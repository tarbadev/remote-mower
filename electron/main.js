const { app, BrowserWindow, ipcMain, protocol } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev') && process.env.NODE_ENV === 'development'
const log = require('electron-log')
const autoUpdater = require('./autoUpdate')
const Protocol = require('./protocol')
const i18n = require('./i18n.config')
const createMenu = require('./menu')
const { mainBindings } = require('./internationalization')

log.info('App starting...')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  } else {
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler)
  }

  return mainWindow.loadURL(
    isDev
      ? 'http://localhost:40992'
      : `${Protocol.scheme}://rse/index.html`,
  )
}

i18n.on('languageChanged', lng => {
  log.debug(`Language changed to ${lng}, rebuilding menu`)
  mainWindow.webContents.send('language-changed', lng)
  createMenu(i18n)
})

protocol.registerSchemesAsPrivileged([{
  scheme: Protocol.scheme,
  privileges: {
    standard: true,
    secure: true,
  },
}])

app.on('ready', function () {
  mainBindings(i18n, ipcMain)

  createMenu(i18n)

  createWindow()

  autoUpdater.checkForUpdatesAndNotify()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.allowRendererProcessReuse = false