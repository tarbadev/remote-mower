import { retrieveToken } from './LoginRepository'
import { request } from './Utils'

export const getBatteryLevel = async () => {
  return retrieveToken().then(token => {
    const options = {
      url: 'https://amc-api.dss.husqvarnagroup.net/app/v1/mowers',
      method: 'GET',
      headers: {
        'Authorization-Provider': 'husqvarna',
        'x-system-validator': 'amc',
        'Authorization': `Bearer ${token}`,
      }
    }
    return request(options).then(data => data[0].status.batteryPercent)
  })
}