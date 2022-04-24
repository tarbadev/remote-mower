import { getMowerId } from '../infrastructure/MowerRepository'
import AppConfig from '../application/shared/app.config'
import { retrieveToken } from '../infrastructure/LoginRepository'
import { makeRequest } from '../application/Utils'

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
    headers: { ...headers, redirect: 'follow' },
  }
  return makeRequest(options).then(data => data.timers)
}

export const setMowerSchedule = async (newSchedules) => {
  const mowerId = await getMowerId()
  const headers = await generateHeaders()
  const options = {
    url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/timers`,
    method: 'PUT',
    headers,
    body: { timers: newSchedules },
  }
  return makeRequest(options)
}