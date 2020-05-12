const { app, BrowserWindow, Menu, ipcMain, protocol } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev') && process.env.NODE_ENV === 'development'
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

const backend = require("../lib/backend")
const fs = require("fs")
const Protocol = require('./protocol')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

log.info('App starting...')

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  log.info('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.')
})
autoUpdater.on('error', (err) => {
  log.info('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
  log.info(log_message)
})
autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded')
})

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.webContents.openDevTools()
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler)
  }

  backend.mainBindings(ipcMain, mainWindow, fs, isDev ? '.' : Protocol.distPath)

  return mainWindow.loadURL(
    isDev
      ? 'http://localhost:40992'
      : `${Protocol.scheme}://rse/index.html`,
  )
}

function createMenu() {
  const isMac = process.platform === 'darwin'
  const appName = 'Remote Mower'

  const template = [
    ...(isMac ? [{
      label: appName,
      submenu: [
        { role: 'about', label: `About ${appName}` },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide', label: `Hide ${appName}` },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: `Quit ${appName}` },
      ],
    }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://github.com/tarbadev/remote-mower')
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

protocol.registerSchemesAsPrivileged([{
  scheme: Protocol.scheme,
  privileges: {
    standard: true,
    secure: true,
  },
}])

app.on('ready', function () {
  createMenu()

  autoUpdater.checkForUpdatesAndNotify()

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  } else {
    backend.clearMainBindings(ipcMain)
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.allowRendererProcessReuse = false