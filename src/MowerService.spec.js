import { retrieveToken } from './LoginRepository'

import response from 'testResources/mowers.json'
import { getMowerStatus, MowerActivity, MowerState } from './MowerService'

jest.mock('./LoginRepository')

describe('MowerService', () => {
  describe('getBatteryLevel', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const expectedRequestOptions = {
        url: 'http://localhost:8080/app/v1/mowers',
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        }
      }

      window.api.request.mockResolvedValueOnce(response)
      retrieveToken.mockResolvedValueOnce(token)

      const expectedStatus = {
        batteryLevel: 67,
        activity: MowerActivity.PARKED_IN_CS,
        state: MowerState.RESTRICTED,
      }

      expect(await getMowerStatus()).toEqual(expectedStatus)

      expect(retrieveToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})