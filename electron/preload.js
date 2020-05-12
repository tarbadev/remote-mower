const {
  contextBridge,
  ipcRenderer,
} = require('electron')
const { net } = require('electron').remote
const backend = require('../lib/backend')
const log = require('electron-log')
const { setPassword, findPassword, deletePassword } = require('keytar')

const SERVICE_NAME = 'RemoteMower'

contextBridge.exposeInMainWorld(
  'api', {
    i18nextElectronBackend: backend.preloadBindings(ipcRenderer),
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