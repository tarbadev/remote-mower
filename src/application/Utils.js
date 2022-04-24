import { refreshToken } from '../domain/LoginService'
import { retrieveToken } from '../infrastructure/LoginRepository'

const { request } = window.api

export const minuteToTimeString = (minutes) => {
  const hours = minutes / 60
  const roundedHours = `${Math.floor(hours)}`.padStart(2, '0')

  const remainingMinutes = `${(minutes - roundedHours * 60)}`.padStart(2, '0')
  return `${roundedHours}:${remainingMinutes}`

}

const generateHeaders = async () => {
  const token = await retrieveToken()
  return {
    'Authorization-Provider': 'husqvarna',
    'x-system-validator': 'amc',
    'Authorization': `Bearer ${token}`,
  }
}

export const makeAuthenticatedRequest = async (options, refreshTokenOnError = true) => {
  const authenticationRequests = await generateHeaders()

  const optionsWithAuthHeader = {
    ...options,
    headers: {
      ...options.headers,
      ...authenticationRequests,
    }
  }
  return makeRequest(optionsWithAuthHeader, refreshTokenOnError)
}

export const makeRequest = (options, refreshTokenOnError = true) =>
  request(options)
    .catch((err) => {
      if (typeof err === 'number' && err === 401 && refreshTokenOnError) {
        return refreshToken().then(() => makeRequest(options, false))
      } else {
        console.log({ err })
      }
    })