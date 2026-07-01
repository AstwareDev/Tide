import { getGmailClient } from "./client.js";

function decodeBody(payload) {
  if (!payload) return "";

  const tryDecode = (data) => {
    if (!data) return "";
    try {
      return Buffer.from(data, "base64url").toString("utf-8");
    } catch {
      return "";
    }
  };

  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return tryDecode(payload.body.data);
  }

  if (payload.parts) {
    const plain = payload.parts.find((p) => p.mimeType === "text/plain");
    if (plain?.body?.data) return tryDecode(plain.body.data);

    const html = payload.parts.find((p) => p.mimeType === "text/html");
    if (html?.body?.data) {
      return tryDecode(html.body.data).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }

    for (const part of payload.parts) {
      const text = decodeBody(part);
      if (text) return text;
    }
  }

  return "";
}

export function normalizeMessage(msg) {
  const headers = msg.payload?.headers || [];
  const header = (name) => headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || "";

  const body = decodeBody(msg.payload).slice(0, 2000);

  return {
    id: msg.id,
    threadId: msg.threadId,
    subject: header("Subject") || "(no subject)",
    from: header("From"),
    date: parseInt(msg.internalDate, 10),
    labelIds: msg.labelIds || [],
    snippet: msg.snippet || "",
    body,
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
