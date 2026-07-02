import { getGmailClient } from "./client.js";

export async function applyLabel(messageId, labelName) {
  const gmail = await getGmailClient();

  const labelsRes = await gmail.users.labels.list({ userId: "me" });
  const existing = labelsRes.data.labels?.find((l) => l.name.toLowerCase() === labelName.toLowerCase());

  let labelId;
  if (existing) {
    labelId = existing.id;
  } else {
    const created = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: labelName,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    labelId = created.data.id;
  }

  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: { addLabelIds: [labelId] },
  });

  return labelId;
}

export async function removeLabel(messageId, labelId) {
  const gmail = await getGmailClient();
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: { removeLabelIds: [labelId] },
  });
}

export async function archiveMessage(messageId) {
  const gmail = await getGmailClient();
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: { removeLabelIds: ["INBOX"] },
  });
}

export async function unarchiveMessage(messageId) {
  const gmail = await getGmailClient();
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: { addLabelIds: ["INBOX"] },
  });
}

export async function trashMessage(messageId) {
  const gmail = await getGmailClient();
  await gmail.users.messages.trash({ userId: "me", id: messageId });
}

export async function untrashMessage(messageId) {
  const gmail = await getGmailClient();
  await gmail.users.messages.untrash({ userId: "me", id: messageId });
}

export async function applyAction(messageId, action, labelName) {
  switch (action) {
    case "label":
      return applyLabel(messageId, labelName);
    case "archive":
      return archiveMessage(messageId);
    case "delete":
      return trashMessage(messageId);
    case "markRead":
      return removeLabel(messageId, "UNREAD");
    case "markUnread":
      return applyLabel(messageId, "UNREAD");
    case "skip":
    default:
      return null;
  }
}
