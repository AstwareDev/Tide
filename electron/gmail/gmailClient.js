import { google } from 'googleapis'
import { getOAuth2Client } from '../auth/gmailAuth.js'

export async function getGmailClient() {
  const auth = await getOAuth2Client()
  return google.gmail({ version: 'v1', auth })
}
