export interface IElectronAPI {
  onDeviceListUpdate: (callback: any) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
