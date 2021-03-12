const {
  contextBridge,
} = require('electron')
const { net } = require('electron').remote
const log = require('electron-log')
const RequestError = require('../src/shared/RequestError')
const { setPassword, getPassword, deletePassword } = require('keytar')
const { bindI18nClient } = require('./internationalization')
const settings = require('electron-settings')

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
    request: ({ body, ...options }) => {
      return new Promise((resolve, reject) => {
        if (!navigator.onLine) {
          reject(RequestError.NO_NETWORK)
        }

        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...options.headers,
        }

        const requestOptions = {
          ...options,
          headers,
        }

        log.debug(`Starting ${options.method} request to ${options.url}`)

        const request = net.request(requestOptions)

        request.on('response', response => {
          if (response.statusCode >= 400) {
            log.error(`Request failed with status ${response.statusCode}`)
            reject(response.statusCode)
          } else {
            let content = ''
            response.on('end', () => {
              log.debug('Request successful')
              resolve(JSON.parse(content))
            })
            response.on('data', (chunk) => {
              content += chunk
            })
          }
        })

        request.on('error', (error) => {
          log.error(`An error happened while sending a request to ${options.url}`)
          log.debug(error)
          reject(error)
        })

        if (body) {
          request.write(JSON.stringify(body))
        }

        request.end()
      })
    },
    getSetting: key => settings.get(key),
    setSetting: (key, value) => settings.set(key, value),
  },
)