import { retrieveToken } from './LoginRepository'
import AppConfig from './shared/app.config'
import { getMowerId, storeMowerId } from './MowerRepository'

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

export const getMowerStatus = async () => {
  const mowerId = await getMowerId()
  const headers = await generateHeaders()
  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/status`,
    method: 'GET',
    headers,
  }
  return request(options).then(data => {
    return {
      batteryLevel: data.batteryPercent,
      activity: data.mowerStatus.activity,
      state: data.mowerStatus.state,
    }
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
  return request(options).then(data => {
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
    return request(options).then(data => storeMowerId(data[0].id))
  }
}

export const parkUntilFurtherNotice = async () => {
  const mowerId = await getMowerId()
  const headers = await generateHeaders()

  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/park`,
    method: 'POST',
    headers,
  }
  return request(options)
}