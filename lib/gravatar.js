import md5 from "blueimp-md5";

export function extractEmail(from) {
  if (!from) return "";
  const match = from.match(/<([^>]+)>/);
  return (match ? match[1] : from).trim().toLowerCase();
}

// Last-resort fallback, tried after the People API contact photo and the
// sender's domain favicon have both failed/come up empty.
export function gravatarUrl(from, size = 64) {
  const email = extractEmail(from);
  if (!email) return null;
  return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}&d=404`;
}

// Personal webmail domains where a favicon would be meaningless (it'd just be
// the Gmail/Outlook/etc. logo repeated for every contact using that provider).
const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "yandex.com",
  "zoho.com",
]);

// The sender's domain, or null when a favicon would be meaningless (personal
// webmail) or unavailable (no domain).
export function faviconDomain(from) {
  const email = extractEmail(from);
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain || PERSONAL_EMAIL_DOMAINS.has(domain)) return null;
  return domain;
}

// Builds the Google favicon URL for a domain. Mainly benefits automated/
// notification senders (LinkedIn, GitHub, Temu, etc.) where the company's
// brand icon is more useful than a generic avatar.
//
// IMPORTANT: Google's favicon service returns a generic globe *image* with a
// 404 status when the domain has no real favicon. Browsers render a 404
// response that carries a valid image body (and fire `load`, not `error`), so
// this URL cannot be dropped into an <img> cascade and relied on to fail — it
// must be validated server-side against its HTTP status first (see
// resolveFavicon in lib/google/people.js).
export function faviconUrlForDomain(domain, size = 64) {
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?sz=${size}&domain=${encodeURIComponent(domain)}`;
}

export function avatarColor(seed) {
  const str = seed || "?";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 58%, 42%)`;
}
