import { retrieveToken } from './LoginRepository'
import { request } from './Utils'

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
  return retrieveToken().then(token => {
    const options = {
      url: 'https://amc-api.dss.husqvarnagroup.net/app/v1/mowers',
      method: 'GET',
      headers: {
        'Authorization-Provider': 'husqvarna',
        'x-system-validator': 'amc',
        'Authorization': `Bearer ${token}`,
      },
    }
    return request(options).then(data => {
      const mower = data[0]
      return {
        batteryLevel: mower.status.batteryPercent,
        activity: mower.status.mowerStatus.activity,
        state: mower.status.mowerStatus.state,
      }
    })
  })
}