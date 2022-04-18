const { ipcMain, net } = require('electron')
const log = require('electron-log')
const settings = require('electron-settings')

ipcMain.handle('makeRequest', async (event, { body, ...options }) => {
  return await new Promise(resolve => {
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
      console.log(`STATUS: ${response.statusCode}`)
      console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
      if (response.statusCode >= 400) {
        log.error(`Request failed with status ${response.statusCode}`)
        resolve({ error: response.statusCode })
      } else {
        let content = ''
        response.on('end', () => {
          log.debug('Request successful')
          resolve({ result: JSON.parse(content) })
        })
        response.on('data', (chunk) => {
          content += chunk
        })
      }
    })

    request.on('error', (error) => {
      log.error(`An error happened while sending a request to ${options.url}`)
      log.debug(error)
      resolve({ error })
    })

    if (body) {
      request.write(JSON.stringify(body))
    }

    request.end()
  })
})

ipcMain.handle('getSetting', async (event, key) => await settings.get(key))
ipcMain.handle('setSetting', async (event, key, value) => await settings.set(key, value))