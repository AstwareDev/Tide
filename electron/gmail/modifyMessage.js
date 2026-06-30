import { getGmailClient } from './gmailClient.js'

export async function applyLabel(messageId, labelName) {
  const gmail = await getGmailClient()

  // Find or create the label
  const labelsRes = await gmail.users.labels.list({ userId: 'me' })
  const existing = labelsRes.data.labels?.find(
    (l) => l.name.toLowerCase() === labelName.toLowerCase()
  )

  let labelId
  if (existing) {
    labelId = existing.id
  } else {
    const created = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    })
    labelId = created.data.id
  }

  await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: { addLabelIds: [labelId] },
  })

  return labelId
}

export async function archiveMessage(messageId) {
  const gmail = await getGmailClient()
  await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: { removeLabelIds: ['INBOX'] },
  })
}

export async function trashMessage(messageId) {
  const gmail = await getGmailClient()
  await gmail.users.messages.trash({ userId: 'me', id: messageId })
}

export async function applyAction(messageId, action, labelName) {
  switch (action) {
    case 'label':
      await applyLabel(messageId, labelName)
      break
    case 'archive':
      await archiveMessage(messageId)
      break
    case 'delete':
      await trashMessage(messageId)
      break
    case 'skip':
    default:
      break
  }
}
