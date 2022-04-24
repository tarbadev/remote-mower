import { getMowerId } from '../infrastructure/MowerRepository'
import AppConfig from '../application/shared/app.config'
import { makeAuthenticatedRequest } from '../application/Utils'

export const getMowerSchedule = async () => {
  const mowerId = await getMowerId()
  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/timers`,
    method: 'GET',
    headers: { redirect: 'follow' },
  }
  return makeAuthenticatedRequest(options).then(data => data.timers)
}

export const setMowerSchedule = async (newSchedules) => {
  const mowerId = await getMowerId()
  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/timers`,
    method: 'PUT',
    body: { timers: newSchedules },
  }
  return makeAuthenticatedRequest(options)
}