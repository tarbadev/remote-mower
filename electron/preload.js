const {
  contextBridge,
  ipcRenderer,
} = require('electron')
const { net } = require('electron').remote
const log = require('electron-log')
const { setPassword, findPassword, deletePassword } = require('keytar')

const SERVICE_NAME = 'RemoteMower'
const i18nNamespace = 'translation'

contextBridge.exposeInMainWorld(
  'api', {
    bindI18nClient: (i18nClientArg, changeLanguage, callback) => {
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
    },
    secureStoreToken: async token => {
      log.debug('Storing token')
      await setPassword(SERVICE_NAME, SERVICE_NAME, token)
      log.debug('Token stored')
    },
    secureRetrieveToken: async () => {
      log.debug('Retrieving token')
      const token = await findPassword(SERVICE_NAME)
      log.debug('Token retrieved')
      return token
    },
    secureDeleteToken: async () => {
      log.debug('Deleting token')
      const result = await deletePassword(SERVICE_NAME, SERVICE_NAME)
      log.debug('Token deleted')
      return result
    },
    request: async (url) => {
      return await new Promise(resolve => {
        const request = net.request(url)
        request.on('response', response => {
          if (response.statusCode >= 400) {
            throw new Error(`Http error: ${response.statusCode}`)
          } else {
            let content = ''
            response.on('end', () => {
              resolve(JSON.parse(content))
            })
            response.on('data', (chunk) => {
              content += chunk
            })
          }
        })
        request.end()
      })
    },
  },
)