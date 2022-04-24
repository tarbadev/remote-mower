import { getMowerId } from '../infrastructure/MowerRepository'
import AppConfig from '../application/shared/app.config'
import { makeAuthenticatedRequest } from '../application/Utils'

export const getMowerPositions = async () => {
  const mowerId = await getMowerId()
  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/geofence`,
    method: 'GET',
    headers: { redirect: 'follow' },
  }
  return makeAuthenticatedRequest(options).then(data => data.lastLocations)
}