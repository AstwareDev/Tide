import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: join(__dirname, '../src-tauri/icons/icon.png'),
    webPreferences: {
      preload: join(__dirname, '../out/preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, '../out/renderer/index.html'))
  }
}

ipcMain.handle('greet', (_event, name) => {
  return `Hello, ${name}! You've been greeted from Electron!`
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
