import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  greet: (name) => ipcRenderer.invoke('greet', name),
})
