import { refreshToken } from '../domain/LoginService'

const { request } = window.api

export const minuteToTimeString = (minutes) => {
  const hours = minutes / 60
  const roundedHours = `${Math.floor(hours)}`.padStart(2, '0')

  const remainingMinutes = `${(minutes - roundedHours * 60)}`.padStart(2, '0')
  return `${roundedHours}:${remainingMinutes}`

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