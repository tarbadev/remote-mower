import AppConfig from '../application/shared/app.config'
import { getMowerId, storeMowerId } from '../infrastructure/MowerRepository'
import { makeAuthenticatedRequest } from '../application/Utils'

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
  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/status`,
    method: 'GET',
  }
  return makeAuthenticatedRequest(options).then(data => {
    return ({
      batteryLevel: data.batteryPercent,
      activity: data.mowerStatus.activity,
      state: data.mowerStatus.state,
    })
  })
}

export const getMowerSettings = async () => {
  const mowerId = await getMowerId()

  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/settings`,
    method: 'GET',
  }
  return makeAuthenticatedRequest(options).then(data => {
    const settings = data.settings
    return {
      cuttingLevel: settings.cuttingHeight,
    }
  })
}

export const initializeMowerId = async () => {
  const mowerId = await getMowerId()
  if (!mowerId) {
    const options = {
      url: `${AppConfig.mowerApiUrl}/app/v1/mowers`,
      method: 'GET',
    }
    return makeAuthenticatedRequest(options).then(data => storeMowerId(data[0].id))
  }
}

const getControlOptions = async (urlSuffix, body) => {
  const mowerId = await getMowerId()

  return {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/${urlSuffix}`,
    method: 'POST',
    body,
  }
}

export const parkUntilFurtherNotice = async () => makeAuthenticatedRequest(await getControlOptions('park'))

export const parkUntilNextStart = async () => makeAuthenticatedRequest(await getControlOptions('park/duration/timer'))

export const parkForDuration = async (minutes) => makeAuthenticatedRequest(await getControlOptions(
  'park/duration/period',
  { period: minutes },
))

export const pause = async () => makeAuthenticatedRequest(await getControlOptions('pause'))

export const startAndResume = async () => makeAuthenticatedRequest(await getControlOptions('start'))

export const startForDuration = async (minutes) => makeAuthenticatedRequest(await getControlOptions(
  'start/override/period',
  { period: minutes },
))