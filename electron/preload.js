import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  auth: {
    startOAuth: () => ipcRenderer.invoke('auth:start-oauth'),
    getStatus: () => ipcRenderer.invoke('auth:get-status'),
    disconnect: () => ipcRenderer.invoke('auth:disconnect'),
  },
  gmail: {
    listMessages: (opts) => ipcRenderer.invoke('gmail:list-messages', opts),
    getMessage: (id) => ipcRenderer.invoke('gmail:get-message', { id }),
    listLabels: () => ipcRenderer.invoke('gmail:list-labels'),
  },
  agents: {
    list: () => ipcRenderer.invoke('agents:list'),
    create: (data) => ipcRenderer.invoke('agents:create', data),
    update: (data) => ipcRenderer.invoke('agents:update', data),
    delete: (data) => ipcRenderer.invoke('agents:delete', data),
    runNow: () => ipcRenderer.invoke('agents:run-now'),
    getStatus: () => ipcRenderer.invoke('agents:get-status'),
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    save: (data) => ipcRenderer.invoke('settings:save', data),
  },
  onActivityPush: (callback) => {
    ipcRenderer.on('activity:push', (_e, entry) => callback(entry))
    return () => ipcRenderer.removeAllListeners('activity:push')
  },
  onAgentsStatusChange: (callback) => {
    ipcRenderer.on('agents:status-change', (_e, status) => callback(status))
    return () => ipcRenderer.removeAllListeners('agents:status-change')
  },
})
