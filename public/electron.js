const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { setPassword, findPassword } = require('keytar')
const path = require('path')
const isDev = require('electron-is-dev')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

function logMessage(text) {
  log.info(text)
}

autoUpdater.on('checking-for-update', () => {
  logMessage('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  logMessage('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  logMessage('Update not available.')
})
autoUpdater.on('error', (err) => {
  logMessage('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  logMessage(log_message)
})
autoUpdater.on('update-downloaded', (info) => {
  logMessage('Update downloaded')
})

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  )

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.on('ready', function () {
  const menu = Menu.buildFromTemplate([{
    label: app.name,
    submenu: [
      {
        label: 'About Remote Mower',
        role: 'about',
      },
      {
        label: 'Quit',
        role: 'quit',
      },
    ],
  }])

  Menu.setApplicationMenu(menu)

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

const SERVICE_NAME = 'RemoteMower'

ipcMain.on('store-token', (event, token) => {
  log.info('Storing token')
  setPassword(SERVICE_NAME, SERVICE_NAME, token)
    .then(() => log.info('Token stored'))
    .catch(() => log.error('Error while storing token'))
})

ipcMain.on('retrieve-token', async (event, arg) => {
  log.info('Retrieving token')
  let token = await findPassword(SERVICE_NAME)
  log.info(token)
  event.sender.send('retrieve-token-result', token)
})