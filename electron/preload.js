const {
  contextBridge,
} = require('electron')
const { net } = require('electron').remote
const log = require('electron-log')
const RequestError = require('../src/shared/RequestError')
const { setPassword, findPassword, deletePassword } = require('keytar')
const { bindI18nClient } = require('./internationalization')

const SERVICE_NAME = 'RemoteMower'

contextBridge.exposeInMainWorld(
  'api', {
    bindI18nClient,
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
    request: async ({ body, ...options }) => {
      return await new Promise((resolve, reject) => {
        if (!navigator.onLine) {
          reject(RequestError.NO_NETWORK)
        }

        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }

        const defaults = { headers }
        const requestOptions = {
          ...defaults,
          ...options,
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

        if (body) {
          request.write(JSON.stringify(body))
        }

        request.end()
      })
    },
  },
)