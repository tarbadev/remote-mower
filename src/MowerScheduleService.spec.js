import timersResponse from 'testResources/timers.json'
import { retrieveToken } from './LoginRepository'
import { getMowerId } from './MowerRepository'
import { refreshToken } from './LoginService'
import { getMowerSchedule } from './MowerScheduleService'

jest.mock('./MowerRepository')
jest.mock('./LoginRepository')
jest.mock('./LoginService')

describe('MowerScheduleService', () => {
  describe('getMowerSchedule', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `http://localhost:8080/app/v1/mowers/${mowerId}/timers`,
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      window.api.request.mockResolvedValueOnce(timersResponse)
      retrieveToken.mockResolvedValueOnce(token)

      const expectedSchedule = [
        {
          "start": 780,
          "duration": 255,
          "days": {
            "monday": true,
            "tuesday": true,
            "wednesday": true,
            "thursday": false,
            "friday": false,
            "saturday": false,
            "sunday": false
          }
        },
        {
          "start": 750,
          "duration": 540,
          "days": {
            "monday": false,
            "tuesday": false,
            "wednesday": false,
            "thursday": false,
            "friday": true,
            "saturday": true,
            "sunday": true
          }
        }
      ]

      expect(await getMowerSchedule()).toEqual(expectedSchedule)

      expect(refreshToken).not.toHaveBeenCalled()
      expect(retrieveToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })

    it('refreshes the token on a 401', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `http://localhost:8080/app/v1/mowers/${mowerId}/timers`,
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      window.api.request.mockRejectedValueOnce(401)
      window.api.request.mockResolvedValueOnce(timersResponse)
      retrieveToken.mockResolvedValueOnce(token)
      refreshToken.mockResolvedValueOnce()

      const expectedSchedule = [
        {
          "start": 780,
          "duration": 255,
          "days": {
            "monday": true,
            "tuesday": true,
            "wednesday": true,
            "thursday": false,
            "friday": false,
            "saturday": false,
            "sunday": false
          }
        },
        {
          "start": 750,
          "duration": 540,
          "days": {
            "monday": false,
            "tuesday": false,
            "wednesday": false,
            "thursday": false,
            "friday": true,
            "saturday": true,
            "sunday": true
          }
        }
      ]

      expect(await getMowerSchedule()).toEqual(expectedSchedule)

      expect(refreshToken).toHaveBeenCalled()
      expect(retrieveToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})