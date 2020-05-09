import { retrieveToken } from './LoginRepository'
import { request } from './Utils'

import response from 'testResources/mowers.json'
import { getMowerStatus, MowerActivity } from './MowerService'

jest.mock('./LoginRepository')
jest.mock('./Utils')

describe('MowerService', () => {
  describe('getBatteryLevel', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const expectedRequestOptions = {
        url: 'https://amc-api.dss.husqvarnagroup.net/app/v1/mowers',
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        }
      }

      request.mockResolvedValueOnce(response)
      retrieveToken.mockResolvedValueOnce(token)

      const expectedStatus = {
        batteryLevel: 67,
        activity: MowerActivity.PARKED_IN_CS,
      }

      expect(await getMowerStatus()).toEqual(expectedStatus)

      expect(retrieveToken).toHaveBeenCalled()
      expect(request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})