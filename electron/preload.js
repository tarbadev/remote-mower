const {
  contextBridge,
  ipcRenderer,
} = require('electron')
const log = require('electron-log')
const RequestError = require('../src/shared/RequestError')
const { setPassword, getPassword, deletePassword, findCredentials } = require('keytar')
const { bindI18nClient } = require('./internationalization')

const SERVICE_NAME = 'RemoteMower'
const TOKEN_KEY = `${SERVICE_NAME}_token`

contextBridge.exposeInMainWorld(
  'api', {
    bindI18nClient,
    secureStoreToken: async token => {
      log.debug('Storing token')
      await setPassword(SERVICE_NAME, TOKEN_KEY, token)
      log.debug('Token stored')
    },
    secureRetrieveToken: async () => {
      log.debug('Retrieving token')
      const token = await getPassword(SERVICE_NAME, TOKEN_KEY)
      log.debug('Token retrieved')
      return token
    },
    secureDeleteToken: async () => {
      log.debug('Deleting token')
      const result = await deletePassword(SERVICE_NAME, TOKEN_KEY)
      log.debug('Token deleted')
      return result
    },
    secureStoreCredentials: async (account, password) => {
      log.debug('Storing credentials')
      await setPassword(SERVICE_NAME, account, password)
      log.debug('Credentials stored')
    },
    secureRetrieveCredentials: async () => {
      log.debug('Retrieving credentials')
      const token = await findCredentials(SERVICE_NAME)
      log.debug('Credentials retrieved')
      return token
    },
    request: async (input) => {
      if (!navigator.onLine) {
        throw new Error(RequestError.NO_NETWORK)
      }

      const { result, error } = await ipcRenderer.invoke('makeRequest', input)

      if (error) {
        throw error
      }

      return result
    },
    getSetting: async key => await ipcRenderer.invoke('getSetting', key),
    setSetting: async (key, value) => await ipcRenderer.invoke('setSetting', key, value),
  },
)