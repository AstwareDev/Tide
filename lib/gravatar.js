import md5 from "blueimp-md5";

export function extractEmail(from) {
  if (!from) return "";
  const match = from.match(/<([^>]+)>/);
  return (match ? match[1] : from).trim().toLowerCase();
}

export function gravatarUrl(from, size = 64) {
  const email = extractEmail(from);
  if (!email) return null;
  return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}&d=404`;
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
