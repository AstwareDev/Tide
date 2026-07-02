import { google } from "googleapis";
import { getOAuth2Client } from "@/lib/auth/google";
import { getUserEmail } from "@/lib/kv";
import { faviconDomain, faviconUrlForDomain } from "@/lib/gravatar";

async function getClients() {
  const auth = await getOAuth2Client();
  return {
    people: google.people({ version: "v1", auth }),
    oauth2: google.oauth2({ version: "v2", auth }),
  };
}

function photoFor(person) {
  const photo = person?.photos?.find((p) => !p.default) || person?.photos?.[0];
  return photo?.url || null;
}

function matchesEmail(person, email) {
  return (person?.emailAddresses || []).some((e) => e.value?.toLowerCase() === email);
}

const MAX_AVATAR_ATTEMPTS = 5;

// Only retries on real failures (network/API errors) — a clean "no photo
// found" result is not a failure and should not be retried.
async function withRetries(fn, attempts = MAX_AVATAR_ATTEMPTS, baseDelayMs = 200) {
  let lastErr;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
      }
    }
  }
  throw lastErr;
}

// The People API requires an empty-query "warmup" search before real queries
// return results reliably — the search index is cold otherwise.
// https://developers.google.com/people/v1/contacts#search_the_users_contacts
let warmedUp = null;

async function warmupSearch(people) {
  if (!warmedUp) {
    warmedUp = people.people.searchContacts({ query: "", readMask: "emailAddresses" }).catch(() => {});
  }
  await warmedUp;
}

async function searchSavedContact(people, email) {
  await warmupSearch(people);
  const res = await withRetries(() =>
    people.people.searchContacts({ query: email, readMask: "photos,emailAddresses" })
  );
  const match = (res.data.results || []).map((r) => r.person).find((p) => matchesEmail(p, email));
  return match ? photoFor(match) : null;
}

// otherContacts.search doesn't support a "photos" readMask, so "Other contacts"
// (people auto-collected from Gmail correspondence) have to be listed in full
// and matched by email client-side. Cached in memory since it rarely changes.
let otherContactsCache = null;
const OTHER_CONTACTS_TTL_MS = 30 * 60 * 1000;
const OTHER_CONTACTS_MAX_PAGES = 5;

async function loadOtherContacts(people) {
  const now = Date.now();
  if (otherContactsCache && otherContactsCache.expires > now) return otherContactsCache.byEmail;

  const byEmail = new Map();
  let pageToken;
  let pages = 0;
  do {
    const res = await withRetries(() =>
      people.otherContacts.list({
        pageSize: 1000,
        readMask: "emailAddresses,photos",
        pageToken,
      })
    );
    for (const person of res.data.otherContacts || []) {
      const photo = photoFor(person);
      if (!photo) continue;
      for (const e of person.emailAddresses || []) {
        if (e.value) byEmail.set(e.value.toLowerCase(), photo);
      }
    }
    pageToken = res.data.nextPageToken || null;
    pages += 1;
  } while (pageToken && pages < OTHER_CONTACTS_MAX_PAGES);

  otherContactsCache = { expires: now + OTHER_CONTACTS_TTL_MS, byEmail };
  return byEmail;
}

// Contacts endpoints never include the signed-in account itself, so the
// account owner's own photo is fetched from the OAuth userinfo endpoint
// instead (requires the userinfo.profile scope).
let ownPhotoCache = null;
const OWN_PHOTO_TTL_MS = 30 * 60 * 1000;

async function getOwnPhoto(oauth2) {
  const now = Date.now();
  if (ownPhotoCache && ownPhotoCache.expires > now) return ownPhotoCache.url;

  const url = await withRetries(async () => {
    const res = await oauth2.userinfo.get();
    return res.data.picture || null;
  }).catch(() => null);

  ownPhotoCache = { url, expires: now + OWN_PHOTO_TTL_MS };
  return url;
}

// Common multi-part public suffixes, so a sender at "news.temu.co.uk" strips
// down to "temu.co.uk" rather than the unregistrable "co.uk". Not exhaustive —
// just the widespread ones — which is fine since it only affects the parent
// fallback, never the exact-domain attempt.
const MULTI_PART_TLDS = new Set([
  "co.uk", "org.uk", "gov.uk", "ac.uk", "co.jp", "co.nz", "co.za", "co.in",
  "co.kr", "com.au", "com.br", "com.mx", "com.tr", "com.cn", "com.hk", "com.sg",
]);

// Domains to try in order, most specific first: the exact sending domain, then
// its registrable parent (so "news.temu.com" → "temu.com" surfaces the real
// brand logo when the subdomain itself has no favicon).
function faviconDomainCandidates(domain) {
  if (!domain) return [];
  const candidates = [domain];
  const labels = domain.split(".");
  const isMultiPartTld = labels.length >= 2 && MULTI_PART_TLDS.has(labels.slice(-2).join("."));
  const registrableLen = isMultiPartTld ? 3 : 2;
  if (labels.length > registrableLen) {
    candidates.push(labels.slice(-registrableLen).join("."));
  }
  return candidates;
}

// Google's favicon service returns a valid globe image with a 404 status when a
// domain has no real favicon, so the only reliable "does it exist" signal is
// the HTTP status — which browsers ignore for image bodies but fetch respects.
async function faviconExists(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

async function resolveFavicon(email) {
  const domain = faviconDomain(email);
  for (const candidate of faviconDomainCandidates(domain)) {
    const url = faviconUrlForDomain(candidate);
    if (url && (await faviconExists(url))) return url;
  }
  return null;
}

const avatarCache = new Map();
const AVATAR_TTL_MS = 30 * 60 * 1000;

export async function getAvatarUrls(emails) {
  const unique = [...new Set(emails.filter(Boolean).map((e) => e.toLowerCase()))];
  if (!unique.length) return {};

  const now = Date.now();
  const toFetch = unique.filter((e) => !avatarCache.has(e) || avatarCache.get(e).expires < now);

  if (toFetch.length) {
    const { people, oauth2 } = await getClients();
    const ownEmail = (await getUserEmail().catch(() => null))?.toLowerCase() || null;
    const otherContacts = await loadOtherContacts(people).catch(() => new Map());

    await Promise.all(
      toFetch.map(async (email) => {
        let url;
        if (email === ownEmail) {
          url = await getOwnPhoto(oauth2);
        } else {
          url = otherContacts.get(email) || null;
          if (!url) {
            url = await searchSavedContact(people, email).catch(() => null);
          }
        }
        // No contact photo → fall back to the sender's real (HTTP-200-verified)
        // domain favicon. Validated here rather than in the client cascade
        // because the browser can't tell Google's 404 globe from a real icon.
        if (!url) {
          url = await resolveFavicon(email);
        }
        avatarCache.set(email, { url, expires: now + AVATAR_TTL_MS });
      })
    );
  }

  const map = {};
  unique.forEach((email) => {
    map[email] = avatarCache.get(email)?.url || null;
  });
  return map;
}
