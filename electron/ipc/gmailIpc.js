import { ipcMain } from 'electron'

export function registerGmailIpc() {
  ipcMain.handle('gmail:list-messages', async (_e, opts) => {
    return { messages: [], nextPageToken: null }
  })

  ipcMain.handle('gmail:get-message', async (_e, { id }) => {
    return null
  })

  ipcMain.handle('gmail:list-labels', async () => {
    return { labels: [] }
  })
}
