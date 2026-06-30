import { app, BrowserWindow, shell } from "electron";
import { join } from "path";
import { fileURLToPath } from "url";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
const __dirname$1 = fileURLToPath(new URL(".", import.meta.url));
let mainWindow = null;
function getMainWindow() {
  return mainWindow;
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname$1, "../out/preload/preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname$1, "../out/renderer/index.html"));
  }
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}
app.whenReady().then(async () => {
  const { registerAuthIpc } = await import("./authIpc-CLAH4iHi.js");
  const { registerGmailIpc } = await import("./gmailIpc-DK2RH5sD.js");
  const { registerAgentIpc } = await import("./agentIpc-B13TosCC.js");
  const { registerSettingsIpc } = await import("./settingsIpc-W-VgZ2jR.js");
  registerAuthIpc();
  registerGmailIpc();
  registerAgentIpc();
  registerSettingsIpc();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
export {
  getMainWindow
};
