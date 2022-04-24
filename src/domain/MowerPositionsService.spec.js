import positionsResponse from 'testResources/positions.json'
import { getMowerId } from '../infrastructure/MowerRepository'
import { getMowerPositions } from './MowerPositionsService'
import AppConfig from '../application/shared/app.config'
import { makeAuthenticatedRequest } from '../application/Utils'

jest.mock('../infrastructure/MowerRepository')
jest.mock('../application/Utils')

describe('MowerPositionsService', () => {
  describe('getMowerPositions', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/geofence`,
        method: 'GET',
        headers: {
          'redirect': 'follow',
        },
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      makeAuthenticatedRequest.mockResolvedValueOnce(positionsResponse)

      expect(await getMowerPositions()).toEqual(positionsResponse.lastLocations)

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})