// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'
import { IPC_EVENTS } from './ipc/events'

contextBridge.exposeInMainWorld('electronAPI', {
  onDeviceListUpdate: (callback: any) =>
    ipcRenderer.on(IPC_EVENTS.deviceListUpdate, (_event, value) =>
      callback(value)
    )
})
