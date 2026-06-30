import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

let mainWindow = null

export function getMainWindow() {
  return mainWindow
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../out/preload/preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../out/renderer/index.html'))
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(async () => {
  const { registerAuthIpc } = await import('./ipc/authIpc.js')
  const { registerGmailIpc } = await import('./ipc/gmailIpc.js')
  const { registerAgentIpc } = await import('./ipc/agentIpc.js')
  const { registerSettingsIpc } = await import('./ipc/settingsIpc.js')

  registerAuthIpc()
  registerGmailIpc()
  registerAgentIpc()
  registerSettingsIpc()

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
