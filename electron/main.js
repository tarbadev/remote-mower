const { app, BrowserWindow, ipcMain, protocol } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev') && process.env.NODE_ENV === 'development'
const log = require('electron-log')
const Protocol = require('./protocol')
const createMenu = require('./menu')
const autoUpdater = require('./autoUpdate')
const internationalization = require('./internationalization')
require('./eventHandler')

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

  // mainWindow.webContents.openDevTools()

  if (!isDev) {
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler)
  }

  return mainWindow.loadURL(
    isDev
      ? 'http://localhost:40992'
      : `${Protocol.scheme}://rse/index.html`,
  )
}

protocol.registerSchemesAsPrivileged([{
  scheme: Protocol.scheme,
  privileges: {
    standard: true,
    secure: true,
  },
}])

const languageChangedCallback = lng => {
  log.debug(`Language changed to ${lng}, rebuilding menu`)
  mainWindow.webContents.send('language-changed', lng)
  createMenu()
}

app.on('ready', function () {
  internationalization.mainBindings(ipcMain, languageChangedCallback)
  autoUpdater.mainBindings()

  createMenu()

  createWindow()
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

process.on('uncaughtException', error => console.error(error))