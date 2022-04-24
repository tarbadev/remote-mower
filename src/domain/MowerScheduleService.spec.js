import timersResponse from 'testResources/timers.json'
import { getMowerId } from '../infrastructure/MowerRepository'
import { getMowerSchedule, setMowerSchedule } from './MowerScheduleService'
import AppConfig from '../application/shared/app.config'
import { makeAuthenticatedRequest } from '../application/Utils'

jest.mock('../infrastructure/MowerRepository')
jest.mock('../application/Utils')

describe('MowerScheduleService', () => {
  describe('getMowerSchedule', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/timers`,
        method: 'GET',
        headers: {
          'redirect': 'follow',
        },
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      makeAuthenticatedRequest.mockResolvedValueOnce(timersResponse)

      const expectedSchedule = [
        {
          'start': 780,
          'duration': 255,
          'days': {
            'monday': true,
            'tuesday': true,
            'wednesday': true,
            'thursday': false,
            'friday': false,
            'saturday': false,
            'sunday': false,
          },
        },
        {
          'start': 750,
          'duration': 540,
          'days': {
            'monday': false,
            'tuesday': false,
            'wednesday': false,
            'thursday': false,
            'friday': true,
            'saturday': true,
            'sunday': true,
          },
        },
      ]

      expect(await getMowerSchedule()).toEqual(expectedSchedule)

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('setMowerSchedule', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const newSchedule = []
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/timers`,
        method: 'PUT',
        body: { timers: newSchedule },
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      makeAuthenticatedRequest.mockResolvedValueOnce(timersResponse)

      await setMowerSchedule(newSchedule)

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})