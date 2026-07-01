import { appendActivity, listActivity, updateActivityEntry } from "@/lib/kv";
import { applyAction, removeLabel, unarchiveMessage, untrashMessage } from "@/lib/gmail/modifyMessage";

const REVERSE_ACTION = {
  label: async (entry) => {
    if (entry.labelId) await removeLabel(entry.messageId, entry.labelId);
  },
  archive: async (entry) => unarchiveMessage(entry.messageId),
  delete: async (entry) => untrashMessage(entry.messageId),
};

export async function logAgentAction({ agentName, messageId, threadId, subject, from, action, labelApplied, labelId, reason }) {
  const entry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    agentName,
    messageId,
    threadId,
    emailSubject: subject,
    emailFrom: from,
    action,
    labelApplied: labelApplied || null,
    labelId: labelId || null,
    reason,
    undoable: action in REVERSE_ACTION,
    undone: false,
  };
  await appendActivity(entry);
  return entry;
}

export async function getActivity(limit = 100) {
  return listActivity(limit);
}

export async function undoActivityEntry(entryId) {
  const entries = await listActivity(200);
  const entry = entries.find((e) => e.id === entryId);
  if (!entry) throw new Error("Activity entry not found");
  if (!entry.undoable || entry.undone) throw new Error("This action cannot be undone");

  const reverse = REVERSE_ACTION[entry.action];
  if (!reverse) throw new Error("This action cannot be undone");

  await reverse(entry);
  return updateActivityEntry(entryId, { undone: true });
}

export { applyAction };
