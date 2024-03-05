import { SerialPort } from 'electron'
import React from 'react'
import Home from './pages/home'
import { TooltipProvider } from '@shadcn/components/ui/tooltip'

const App = () => {
  const onBtnClick = async () => {
    const ports = navigator.serial.getPorts()
    console.log(navigator.serial)
    ports.then((p) => console.log(p))
  }
  return (
    <TooltipProvider>
      <Home />
    </TooltipProvider>
  )
}

export default App
