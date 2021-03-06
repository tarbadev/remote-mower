const { autoUpdater } = require('electron-updater')
const log = require('electron-log')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

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

const mainBindings = () => {
  autoUpdater.checkForUpdatesAndNotify()
}

module.exports = { mainBindings }