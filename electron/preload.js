const {
  contextBridge,
  ipcRenderer,
} = require('electron')
const log = require('electron-log')
const RequestError = require('../src/shared/RequestError')
const { setPassword, getPassword, deletePassword } = require('keytar')
const { bindI18nClient } = require('./internationalization')

const SERVICE_NAME = 'RemoteMower'
const TOKEN_KEY = `${SERVICE_NAME}_token`
const REFRESH_TOKEN_KEY = `${SERVICE_NAME}_refresh_token`

contextBridge.exposeInMainWorld(
  'api', {
    bindI18nClient,
    secureStoreToken: async token => {
      log.debug('Storing token')
      await setPassword(SERVICE_NAME, TOKEN_KEY, token)
      log.debug('Token stored')
    },
    secureStoreRefreshToken: async refreshToken => {
      log.debug('Storing refresh token')
      await setPassword(SERVICE_NAME, REFRESH_TOKEN_KEY, refreshToken)
      log.debug('Refresh token stored')
    },
    secureRetrieveToken: async () => {
      log.debug('Retrieving token')
      const token = await getPassword(SERVICE_NAME, TOKEN_KEY)
      log.debug('Token retrieved')
      return token
    },
    secureRetrieveRefreshToken: async () => {
      log.debug('Retrieving refresh token')
      const refreshToken = await getPassword(SERVICE_NAME, REFRESH_TOKEN_KEY)
      log.debug('Refresh token retrieved')
      return refreshToken
    },
    secureDeleteToken: async () => {
      log.debug('Deleting token')
      const result = await deletePassword(SERVICE_NAME, TOKEN_KEY)
      log.debug('Token deleted')
      return result
    },
    secureDeleteRefreshToken: async () => {
      log.debug('Deleting refresh token')
      const result = await deletePassword(SERVICE_NAME, REFRESH_TOKEN_KEY)
      log.debug('Refresh token deleted')
      return result
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