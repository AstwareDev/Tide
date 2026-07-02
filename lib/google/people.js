import { google } from "googleapis";
import { getOAuth2Client } from "@/lib/auth/google";

async function getPeopleClient() {
  const auth = await getOAuth2Client();
  return google.people({ version: "v1", auth });
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

const avatarCache = new Map();
const AVATAR_TTL_MS = 30 * 60 * 1000;

export async function getAvatarUrls(emails) {
  const unique = [...new Set(emails.filter(Boolean).map((e) => e.toLowerCase()))];
  if (!unique.length) return {};

  const now = Date.now();
  const toFetch = unique.filter((e) => !avatarCache.has(e) || avatarCache.get(e).expires < now);

  if (toFetch.length) {
    const people = await getPeopleClient();
    const otherContacts = await loadOtherContacts(people).catch(() => new Map());

    await Promise.all(
      toFetch.map(async (email) => {
        let url = otherContacts.get(email) || null;
        if (!url) {
          url = await searchSavedContact(people, email).catch(() => null);
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
