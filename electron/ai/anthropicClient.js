import Anthropic from '@anthropic-ai/sdk'
import { getStore } from '../store/appStore.js'

let client = null
let cachedKey = null

export async function getAnthropicClient() {
  const store = await getStore()
  const key = store.get('settings.anthropicApiKey')

  if (!key) throw new Error('Anthropic API key not configured. Go to Settings to add it.')

  if (client && cachedKey === key) return client

  client = new Anthropic({ apiKey: key })
  cachedKey = key
  return client
}
