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

// Tried after the People API contact photo comes up empty, before falling
// back to Gravatar — mainly benefits automated/notification senders
// (LinkedIn, GitHub, CodePen, etc.) where the company's brand icon is more
// useful than a generic avatar. Google's favicon service 404s (rather than
// returning a generic placeholder) when the domain has no real favicon, so
// the SenderAvatar cascade correctly advances to Gravatar in that case.
export function faviconUrl(from, size = 64) {
  const email = extractEmail(from);
  const domain = email.split("@")[1];
  if (!domain || PERSONAL_EMAIL_DOMAINS.has(domain.toLowerCase())) return null;
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
