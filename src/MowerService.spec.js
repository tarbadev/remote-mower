import mowersResponse from 'testResources/mowers.json'
import statusResponse from 'testResources/status.json'
import settingsResponse from 'testResources/settings.json'
import { getMowerSettings, getMowerStatus, initializeMowerId, MowerActivity, MowerState } from './MowerService'
import { retrieveToken } from './LoginRepository'
import { getMowerId, storeMowerId } from './MowerRepository'

jest.mock('./LoginRepository')
jest.mock('./MowerRepository')

describe('MowerService', () => {
  describe('initializeMowerId', () => {
    it('calls the mower API when the id is not stored already', async () => {
      const token = 'SuperSecureToken'
      const expectedRequestOptions = {
        url: 'http://localhost:8080/app/v1/mowers',
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      window.api.request.mockResolvedValueOnce(mowersResponse)
      retrieveToken.mockResolvedValueOnce(token)
      getMowerId.mockResolvedValueOnce(undefined)

      await initializeMowerId()

      expect(getMowerId).toHaveBeenCalled()
      expect(storeMowerId).toHaveBeenCalledWith('190415242-190632991')
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })

    it('does not call the mower API when the id is already stored', async () => {
      const token = 'SuperSecureToken'
      retrieveToken.mockResolvedValueOnce(token)
      getMowerId.mockResolvedValueOnce('190415242-190632991')

      await initializeMowerId()

      expect(storeMowerId).not.toHaveBeenCalled()
      expect(window.api.request).not.toHaveBeenCalled()
    })
  })

  describe('getMowerStatus', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `http://localhost:8080/app/v1/mowers/${mowerId}/status`,
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      window.api.request.mockResolvedValueOnce(statusResponse)
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

  describe('getMowerSettings', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `http://localhost:8080/app/v1/mowers/${mowerId}/settings`,
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      window.api.request.mockResolvedValueOnce(settingsResponse)
      getMowerId.mockResolvedValueOnce(mowerId)
      retrieveToken.mockResolvedValueOnce(token)

      const expectedSettings = {
        cuttingLevel: 7,
      }

      expect(await getMowerSettings()).toEqual(expectedSettings)

      expect(retrieveToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})