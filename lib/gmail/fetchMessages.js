import { getGmailClient } from "./client.js";

function tryDecode(data) {
  if (!data) return "";
  try {
    return Buffer.from(data, "base64url").toString("utf-8");
  } catch {
    return "";
  }
}

// Walks the MIME tree collecting the first text/plain and text/html parts it
// finds, so callers can prefer the richer HTML rendering (like Gmail does)
// while still falling back to plain text for text-only messages.
function collectBodies(payload, acc = { text: null, html: null }) {
  if (!payload) return acc;

  if (payload.mimeType === "text/plain" && payload.body?.data && acc.text === null) {
    acc.text = tryDecode(payload.body.data);
  } else if (payload.mimeType === "text/html" && payload.body?.data && acc.html === null) {
    acc.html = tryDecode(payload.body.data);
  }

  if (payload.parts) {
    for (const part of payload.parts) collectBodies(part, acc);
  }

  return acc;
}

const MAX_HTML_LENGTH = 300000;
const MAX_TEXT_LENGTH = 20000;

export function normalizeMessage(msg) {
  const headers = msg.payload?.headers || [];
  const header = (name) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

  const { text, html } = collectBodies(msg.payload);
  const bodyType = html ? "html" : "text";
  const rawBody = html ?? text ?? "";
  const body = rawBody.slice(0, bodyType === "html" ? MAX_HTML_LENGTH : MAX_TEXT_LENGTH);

  return {
    id: msg.id,
    threadId: msg.threadId,
    subject: header("Subject") || "(no subject)",
    from: header("From"),
    date: parseInt(msg.internalDate, 10),
    labelIds: msg.labelIds || [],
    snippet: msg.snippet || "",
    body,
    bodyType,
    classification: null,
  };
}

export async function listMessages({ maxResults = 50, pageToken } = {}) {
  const gmail = await getGmailClient();

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    pageToken,
  });

  return {
    messages: res.data.messages || [],
    nextPageToken: res.data.nextPageToken || null,
  };
}

export async function listUnlabeledMessages({ maxResults = 100 } = {}) {
  const gmail = await getGmailClient();

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    q: "-has:userlabels",
  });

  return res.data.messages || [];
}

export async function getMessage(id) {
  const gmail = await getGmailClient();
  const res = await gmail.users.messages.get({ userId: "me", id, format: "full" });
  return normalizeMessage(res.data);
}

export async function getMessages(ids) {
  return Promise.all(ids.map((id) => getMessage(id)));
}

export async function getUserProfile() {
  const gmail = await getGmailClient();
  const res = await gmail.users.getProfile({ userId: "me" });
  return res.data;
}

export async function listLabels() {
  const gmail = await getGmailClient();
  const res = await gmail.users.labels.list({ userId: "me" });
  return res.data.labels || [];
}
