import { ipcMain } from 'electron'

export function registerSettingsIpc() {
  ipcMain.handle('settings:get', async () => ({
    anthropicApiKey: '',
    pollingIntervalMs: 300000,
    maxConcurrentClassifications: 5,
  }))

  ipcMain.handle('settings:save', async (_e, data) => ({ success: true }))
}
