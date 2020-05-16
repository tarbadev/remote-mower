const { Menu } = require('electron')
const { mapKeyToTranslation, changeLanguage } = require('./internationalization')

const createMenu = () => {
  const isMac = process.platform === 'darwin'
  const appName = 'Remote Mower'

  const template = [
    ...(isMac ? [{
      label: appName,
      submenu: [
        { role: 'about', label: `${mapKeyToTranslation('menu.about')} ${appName}` },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide', label: `${mapKeyToTranslation('menu.hide')} ${appName}` },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit', label: `${mapKeyToTranslation('menu.quit')} ${appName}` },
      ],
    }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      label: mapKeyToTranslation('menu.view'),
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
      label: mapKeyToTranslation('menu.language.label'),
      submenu: [
        {
          label: 'English',
          click: () => changeLanguage('en'),
        },
        {
          label: 'Français',
          click: () => changeLanguage('fr'),
        },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: mapKeyToTranslation('menu.help.learnMore'),
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