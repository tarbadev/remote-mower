const { Menu } = require('electron')
const i18n = require('./i18n.config')

const createMenu = () => {
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

module.exports = createMenu