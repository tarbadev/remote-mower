import positionsResponse from 'testResources/positions.json'
import { retrieveToken } from './LoginRepository'
import { getMowerId } from './MowerRepository'
import { refreshToken } from './LoginService'
import { getMowerPositions } from './MowerPositionsService'
import AppConfig from './shared/app.config'

jest.mock('./MowerRepository')
jest.mock('./LoginRepository')
jest.mock('./LoginService')

describe('MowerPositionsService', () => {
  describe('getMowerPositions', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/geofence`,
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
          'redirect': 'follow',
        },
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      window.api.request.mockResolvedValueOnce(positionsResponse)
      retrieveToken.mockResolvedValueOnce(token)

      expect(await getMowerPositions()).toEqual(positionsResponse.lastLocations)

      expect(refreshToken).not.toHaveBeenCalled()
      expect(retrieveToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })

    it('refreshes the token on a 401', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/geofence`,
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
          'redirect': 'follow',
        },
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      window.api.request.mockRejectedValueOnce(401)
      window.api.request.mockResolvedValueOnce(positionsResponse)
      retrieveToken.mockResolvedValueOnce(token)
      refreshToken.mockResolvedValueOnce()

      expect(await getMowerPositions()).toEqual(positionsResponse.lastLocations)

      expect(refreshToken).toHaveBeenCalled()
      expect(retrieveToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})