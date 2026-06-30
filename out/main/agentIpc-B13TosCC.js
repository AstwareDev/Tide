import { ipcMain } from "electron";
function registerAgentIpc() {
  ipcMain.handle("agents:list", async () => []);
  ipcMain.handle("agents:create", async (_e, data) => ({ ...data, id: crypto.randomUUID() }));
  ipcMain.handle("agents:update", async (_e, data) => data);
  ipcMain.handle("agents:delete", async () => ({ success: true }));
  ipcMain.handle("agents:run-now", async () => ({ started: true }));
  ipcMain.handle("agents:get-status", async () => ({ running: false, lastRunAt: null, processedCount: 0 }));
}
export {
  registerAgentIpc
};
