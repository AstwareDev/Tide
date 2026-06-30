import { ipcMain, app, BrowserWindow } from "electron";
import { join } from "path";
import { fileURLToPath } from "url";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
const __dirname$1 = fileURLToPath(new URL(".", import.meta.url));
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: join(__dirname$1, "../src-tauri/icons/icon.png"),
    webPreferences: {
      preload: join(__dirname$1, "../out/preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname$1, "../out/renderer/index.html"));
  }
}
ipcMain.handle("greet", (_event, name) => {
  return `Hello, ${name}! You've been greeted from Electron!`;
});
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
