import { retrieveToken } from './LoginRepository'
import AppConfig from './shared/app.config'
import { getMowerId, storeMowerId } from './MowerRepository'
import { refreshToken } from './LoginService'

const { request } = window.api

export const MowerActivity = {
  UNKNOWN: 'UNKNOWN',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  MOWING: 'MOWING',
  GOING_TO_CS: 'GOING_HOME',
  CHARGING: 'CHARGING',
  LEAVING_CS: 'LEAVING',
  PARKED_IN_CS: 'PARKED_IN_CS',
  STOPPED_IN_GARDEN: 'STOPPED_IN_GARDEN',
}

Object.freeze(MowerActivity)

export const MowerState = {
  UNKNOWN: 'UNKNOWN',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  PAUSED: 'PAUSED',
  IN_OPERATION: 'IN_OPERATION',
  WAIT_UPDATING: 'WAIT_UPDATING',
  WAIT_POWER_UP: 'WAIT_POWER_UP',
  RESTRICTED: 'RESTRICTED',
  OFF: 'OFF',
  STOPPED: 'STOPPED',
  ERROR: 'ERROR',
  FATAL_ERROR: 'FATAL_ERROR',
  ERROR_AT_POWER_UP: 'ERROR_AT_POWER_UP',
}

Object.freeze(MowerState)

const makeRequest = (options, refreshTokenOnError = true) =>
  request(options)
    .catch((err) => {
      if (typeof err === 'number' && err === 401 && refreshTokenOnError) {
        return refreshToken().then(() => makeRequest(options, false))
      } else {
        console.log({ err })
      }
    })

export const getMowerStatus = async () => {
  const mowerId = await getMowerId()
  const headers = await generateHeaders()
  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/status`,
    method: 'GET',
    headers,
  }
  return makeRequest(options).then(data => {
    return ({
      batteryLevel: data.batteryPercent,
      activity: data.mowerStatus.activity,
      state: data.mowerStatus.state,
    })
  })
}

const generateHeaders = async () => {
  const token = await retrieveToken()
  return {
    'Authorization-Provider': 'husqvarna',
    'x-system-validator': 'amc',
    'Authorization': `Bearer ${token}`,
  }
}

export const getMowerSettings = async () => {
  const mowerId = await getMowerId()
  const headers = await generateHeaders()

  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/settings`,
    method: 'GET',
    headers,
  }
  return makeRequest(options).then(data => {
    const settings = data.settings
    return {
      cuttingLevel: settings.cuttingHeight,
    }
  })
}

export const initializeMowerId = async () => {
  const mowerId = await getMowerId()
  if (!mowerId) {
    const headers = await generateHeaders()
    const options = {
      url: `${AppConfig.mowerApiUrl}/app/v1/mowers`,
      method: 'GET',
      headers,
    }
    return makeRequest(options).then(data => storeMowerId(data[0].id))
  }
}

const getControlOptions = async (urlSuffix, body) => {
  const mowerId = await getMowerId()
  const headers = await generateHeaders()

  return {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/${urlSuffix}`,
    method: 'POST',
    headers,
    body,
  }
}

export const parkUntilFurtherNotice = async () => makeRequest(await getControlOptions('park'))

export const parkUntilNextStart = async () => makeRequest(await getControlOptions('park/duration/timer'))

export const parkForDuration = async (minutes) => makeRequest(await getControlOptions(
  'park/duration/period',
  { period: minutes },
))

export const pause = async () => makeRequest(await getControlOptions('pause'))

export const startAndResume = async () => makeRequest(await getControlOptions('start'))

export const startForDuration = async (minutes) => makeRequest(await getControlOptions(
  'start/override/period',
  { period: minutes },
))