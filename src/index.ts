import { app, BrowserWindow, dialog } from 'electron'
import { IPC_EVENTS } from './ipc/events'
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 1600,
    width: 1800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  })

  mainWindow.removeMenu()

  mainWindow.webContents.session.on(
    'select-serial-port',
    async (event, portList, webContents, callback) => {
      console.log('serial select')
      // Add listeners to handle ports being added or removed before the callback for `select-serial-port`
      // is called.
      mainWindow.webContents.session.on('serial-port-added', (event, port) => {
        // console.log('serial-port-added FIRED WITH', port)
        // Optionally update portList to add the new port
      })

      mainWindow.webContents.session.on(
        'serial-port-removed',
        (event, port) => {
          // console.log('serial-port-removed FIRED WITH', port)
          // Optionally update portList to remove the port
        }
      )
      // webContents.send(IPC_EVENTS.deviceListUpdate, portList)
      // for (let p of portList) {
      //   p.
      //   console.log(p)
      // }
      event.preventDefault()
      // callback(portList.length > 0 ? portList[0].portId : '')
      const res = await dialog.showMessageBox({
        title: 'Select a port',
        type: 'info',
        message: 'Select a serial port',
        buttons: portList.map((p) => `${p.portName}(${p.displayName})`)
      })

      const selectedIdx = res.response
      callback(portList[selectedIdx].portId)
    }
  )

  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      return true
      if (permission === 'serial' && details.securityOrigin === 'file:///') {
        return true
      }

      return false
    }
  )

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    return true
    if (details.deviceType === 'serial' && details.origin === 'file://') {
      return true
    }

    return false
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
