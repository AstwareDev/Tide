import { OAuth2Client } from 'google-auth-library'
import { shell } from 'electron'
import { getStore } from '../store/appStore.js'
import { startOAuthServer } from './oauthServer.js'

// Replace these with your Google Cloud OAuth2 credentials (Desktop App type)
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'
const REDIRECT_PORT = 54321
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

let oauth2Client = null

export async function getOAuth2Client() {
  if (oauth2Client) return oauth2Client

  oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

  // Persist refreshed tokens automatically
  oauth2Client.on('tokens', async (tokens) => {
    const store = await getStore()
    const existing = store.get('gmail.tokens') || {}
    store.set('gmail.tokens', { ...existing, ...tokens })
  })

  // Load stored tokens if they exist
  const store = await getStore()
  const tokens = store.get('gmail.tokens')
  if (tokens) {
    oauth2Client.setCredentials(tokens)
  }

  return oauth2Client
}

export async function startOAuthFlow() {
  const client = await getOAuth2Client()

  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  })

  // Start local redirect catcher before opening the browser
  const codePromise = startOAuthServer(REDIRECT_PORT)
  await shell.openExternal(authUrl)
  const code = await codePromise

  const { tokens } = await client.getToken(code)
  client.setCredentials(tokens)

  const store = await getStore()
  store.set('gmail.tokens', tokens)

  return tokens
}

export async function disconnectGmail() {
  const store = await getStore()
  store.set('gmail.tokens', null)
  store.set('gmail.userEmail', null)
  oauth2Client = null
}

export async function isAuthenticated() {
  const store = await getStore()
  return !!store.get('gmail.tokens')
}
