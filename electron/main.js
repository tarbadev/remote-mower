const { app, BrowserWindow, Menu, ipcMain, protocol } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev') && process.env.NODE_ENV === 'development'
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

const Protocol = require('./protocol')
const i18n = require('./i18n.config')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

log.info('App starting...')

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...')
})
autoUpdater.on('update-available', () => {
  log.info('Update available.')
})
autoUpdater.on('update-not-available', () => {
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
autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded')
})

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
  createMenu()
})

ipcMain.on('get-i18n-language', (event, lng) => event.returnValue = i18n.language)
ipcMain.on('get-i18n-bundle', (event, lng) => event.returnValue = i18n.getResourceBundle(lng, 'translation'))

function createMenu() {
  const isMac = process.platform === 'darwin'
  const appName = 'Remote Mower'

  const template = [
    ...(isMac ? [{
      label: appName,
      submenu: [
        { role: 'about', label: `${i18n.t('menu.about')} ${appName}` },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide', label: `${i18n.t('menu.hide')} ${appName}` },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: `${i18n.t('menu.quit')} ${appName}` },
      ],
    }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      label: i18n.t('menu.view'),
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
      label: i18n.t('menu.language.label'),
      submenu: [
        {
          label: 'English',
          click: () => {
            i18n.changeLanguage('en')
          },
        },
        {
          label: 'Français',
          click: () => {
            i18n.changeLanguage('fr')
          },
        },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: i18n.t('menu.help.learnMore'),
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
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.allowRendererProcessReuse = false