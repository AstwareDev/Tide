import { ipcMain } from 'electron'

export function registerAuthIpc() {
  ipcMain.handle('auth:start-oauth', async () => {
    // TODO: implement OAuth flow
    return { success: false, email: null }
  })

  ipcMain.handle('auth:get-status', async () => {
    return { connected: false, email: null }
  })

  ipcMain.handle('auth:disconnect', async () => {
    return { success: true }
  })
}
