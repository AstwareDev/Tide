import { getGmailClient } from "./client.js";
import { normalizeMessage } from "./fetchMessages.js";

function normalizeThreadSummary(thread) {
  const messages = thread.messages || [];
  const last = messages[messages.length - 1];
  const normalizedLast = last ? normalizeMessage(last) : null;

  const participants = new Set(messages.map((m) => {
    const headers = m.payload?.headers || [];
    return headers.find((h) => h.name.toLowerCase() === "from")?.value || "";
  }).filter(Boolean));

  const labelIds = new Set();
  messages.forEach((m) => (m.labelIds || []).forEach((id) => labelIds.add(id)));

  return {
    id: thread.id,
    snippet: normalizedLast?.snippet || "",
    subject: normalizedLast?.subject || "(no subject)",
    from: normalizedLast?.from || "",
    date: normalizedLast?.date || 0,
    labelIds: [...labelIds],
    messageCount: messages.length,
    participants: [...participants],
    unread: labelIds.has("UNREAD"),
    classification: normalizedLast?.classification || null,
  };
}

export async function listThreads({ maxResults = 50, pageToken, unlabeledOnly = false } = {}) {
  const gmail = await getGmailClient();

  const res = await gmail.users.threads.list({
    userId: "me",
    maxResults,
    pageToken,
    q: unlabeledOnly ? "-has:userlabels" : undefined,
  });

  const summaries = res.data.threads || [];

  // threads.list only returns id/snippet — fetch metadata for each thread to
  // get subject/from/labels needed for the list UI.
  const hydrated = await Promise.all(
    summaries.map(async (t) => {
      const full = await gmail.users.threads.get({ userId: "me", id: t.id, format: "metadata" });
      return normalizeThreadSummary(full.data);
    })
  );

  return {
    threads: hydrated,
    nextPageToken: res.data.nextPageToken || null,
  };
}

export async function getThread(id) {
  const gmail = await getGmailClient();
  const res = await gmail.users.threads.get({ userId: "me", id, format: "full" });
  const messages = (res.data.messages || []).map(normalizeMessage);
  return {
    id: res.data.id,
    messages,
    subject: messages[messages.length - 1]?.subject || "(no subject)",
  };
}
