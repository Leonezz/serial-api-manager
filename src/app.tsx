import { SerialPort, ipcRenderer } from 'electron'
import React from 'react'
import Home from './pages/home'
import { TooltipProvider } from '@shadcn/components/ui/tooltip'
import './extension/string.extension'
import { BUS } from './uievents/eventbus'
import { UI_EVENTS } from './uievents/eventenum'
import { BasicSerialPortInfo } from './device/use-devicelist'
import { Toaster } from '@shadcn/components/ui/toaster'

const App = () => {
  window.electronAPI.onDeviceListUpdate((devices: BasicSerialPortInfo[]) => {
    BUS.emit(UI_EVENTS.DeviceListChange, devices)
  })
  return (
    <TooltipProvider>
      <Home />
      <Toaster />
    </TooltipProvider>
  )
}

export default App
