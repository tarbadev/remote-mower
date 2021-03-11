import { getMowerId } from './MowerRepository'

const { request } = window.api
import { refreshToken } from './LoginService'
import AppConfig from './shared/app.config'
import { retrieveToken } from './LoginRepository'

const makeRequest = (options, refreshTokenOnError = true) =>
  request(options)
    .catch((err) => {
      if (typeof err === 'number' && err === 401 && refreshTokenOnError) {
        return refreshToken().then(() => makeRequest(options, false))
      } else {
        console.log({ err })
      }
    })

const generateHeaders = async () => {
  const token = await retrieveToken()
  return {
    'Authorization-Provider': 'husqvarna',
    'x-system-validator': 'amc',
    'Authorization': `Bearer ${token}`,
  }
}

export const getMowerSchedule = async () => {
  const mowerId = await getMowerId()
  const headers = await generateHeaders()
  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/timers`,
    method: 'GET',
    headers,
  }
  return makeRequest(options).then(data => data.timers)
}