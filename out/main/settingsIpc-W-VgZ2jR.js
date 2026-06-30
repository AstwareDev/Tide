import { ipcMain } from "electron";
function registerSettingsIpc() {
  ipcMain.handle("settings:get", async () => ({
    anthropicApiKey: "",
    pollingIntervalMs: 3e5,
    maxConcurrentClassifications: 5
  }));
  ipcMain.handle("settings:save", async (_e, data) => ({ success: true }));
}
export {
  registerSettingsIpc
};
