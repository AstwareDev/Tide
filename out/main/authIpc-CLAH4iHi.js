import { ipcMain } from "electron";
function registerAuthIpc() {
  ipcMain.handle("auth:start-oauth", async () => {
    return { success: false, email: null };
  });
  ipcMain.handle("auth:get-status", async () => {
    return { connected: false, email: null };
  });
  ipcMain.handle("auth:disconnect", async () => {
    return { success: true };
  });
}
export {
  registerAuthIpc
};
