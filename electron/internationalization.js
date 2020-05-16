const { ipcRenderer } = require('electron')
const log = require('electron-log')

const i18nNamespace = 'translation'

const bindI18nClient = (i18nClientArg, changeLanguage) => {
  const addResourceAndChangeLanguage = lng => {
    if (!i18nClientArg.hasResourceBundle(lng, i18nNamespace)) {
      log.debug(`Add resource ${lng}`)
      const resourceBundle = ipcRenderer.sendSync('get-i18n-bundle', lng)
      i18nClientArg.addResourceBundle(lng, i18nNamespace, resourceBundle)
    }
    changeLanguage(lng)
  }

  ipcRenderer.on('language-changed', (event, lng) => {
    addResourceAndChangeLanguage(lng)
  })

  const language = ipcRenderer.sendSync('get-i18n-language').split('-')[0]

  log.debug(`Loading initial resource ${language}`)
  addResourceAndChangeLanguage(language)
}

module.exports = {
  bindI18nClient,
}