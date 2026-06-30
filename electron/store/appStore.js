let store = null

export async function getStore() {
  if (store) return store
  const { default: Store } = await import('electron-store')
  store = new Store({
    schema: {
      gmail: {
        type: 'object',
        properties: {
          tokens: { type: ['object', 'null'], default: null },
          userEmail: { type: ['string', 'null'], default: null },
        },
        default: { tokens: null, userEmail: null },
      },
      settings: {
        type: 'object',
        properties: {
          anthropicApiKey: { type: 'string', default: '' },
          pollingIntervalMs: { type: 'number', default: 300000 },
          maxConcurrentClassifications: { type: 'number', default: 5 },
        },
        default: {
          anthropicApiKey: '',
          pollingIntervalMs: 300000,
          maxConcurrentClassifications: 5,
        },
      },
      agents: { type: 'array', default: [] },
      processedEmailIds: { type: 'array', default: [] },
    },
  })
  return store
}
