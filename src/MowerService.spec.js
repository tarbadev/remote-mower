import { retrieveToken } from './LoginRepository'
import { request } from './Utils'

import response from 'testResources/mowers.json'
import { getMowerStatus } from './MowerService'

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

      expect(await getMowerStatus()).toEqual({ batteryLevel: 67 })

      expect(retrieveToken).toHaveBeenCalled()
      expect(request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})