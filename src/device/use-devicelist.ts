import { BUS } from '@/uievents/eventbus'
import { UI_EVENTS } from '@/uievents/eventenum'
import { useEffect, useSyncExternalStore } from 'react'

export type BasicSerialPortInfo = Electron.SerialPort

let deviceList = [] as BasicSerialPortInfo[]
let listeners = [] as (() => any)[]

const emitChange = () => {
  for (let listener of listeners) {
    listener()
  }
}

export const deviceListStore = {
  initDeviceList(devices: BasicSerialPortInfo[]) {
    deviceList = [...devices]
    emitChange()
  },

  subscribe(listener: () => any) {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },

  getSnapshot() {
    return deviceList
  }
}

const updateDeviceList = (param: BasicSerialPortInfo[]) => {
  deviceListStore.initDeviceList(param)
}

export const useDeviceListStore = () => {
  const devices = useSyncExternalStore(
    deviceListStore.subscribe,
    deviceListStore.getSnapshot
  )

  useEffect(() => {
    BUS.on(UI_EVENTS.DeviceListChange, updateDeviceList)
    return () => {
      BUS.off(UI_EVENTS.DeviceListChange, updateDeviceList)
    }
  }, [])
  return devices
}
