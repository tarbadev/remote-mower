import mowersResponse from 'testResources/mowers.json'
import statusResponse from 'testResources/status.json'
import settingsResponse from 'testResources/settings.json'
import {
  getMowerSettings,
  getMowerStatus,
  initializeMowerId,
  MowerActivity,
  MowerState,
  parkForDuration,
  parkUntilFurtherNotice,
  parkUntilNextStart,
  pause,
  startAndResume,
  startForDuration,
} from './MowerService'
import { retrieveToken } from '../infrastructure/LoginRepository'
import { getMowerId, storeMowerId } from '../infrastructure/MowerRepository'
import { refreshToken } from './LoginService'
import AppConfig from '../application/shared/app.config'

jest.mock('./LoginService')
jest.mock('./LoginRepository')
jest.mock('./MowerRepository')

describe('MowerService', () => {
  describe('initializeMowerId', () => {
    it('calls the mower API when the id is not stored already', async () => {
      const token = 'SuperSecureToken'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers`,
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
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/status`,
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

      expect(refreshToken).not.toHaveBeenCalled()
      expect(retrieveToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })

    it('refreshes the token on a 401', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/status`,
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      window.api.request.mockRejectedValueOnce(401)
      window.api.request.mockResolvedValueOnce(statusResponse)
      retrieveToken.mockResolvedValueOnce(token)
      refreshToken.mockResolvedValueOnce()

      const expectedStatus = {
        batteryLevel: 67,
        activity: MowerActivity.PARKED_IN_CS,
        state: MowerState.RESTRICTED,
      }

      expect(await getMowerStatus()).toEqual(expectedStatus)

      expect(refreshToken).toHaveBeenCalled()
      expect(retrieveToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('getMowerSettings', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/settings`,
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

  describe('parkUntilFurtherNotice', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/park`,
        method: 'POST',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      window.api.request.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)
      retrieveToken.mockResolvedValueOnce(token)

      await parkUntilFurtherNotice()

      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('parkUntilNextStart', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/park/duration/timer`,
        method: 'POST',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      window.api.request.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)
      retrieveToken.mockResolvedValueOnce(token)

      await parkUntilNextStart()

      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('parkForDuration', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const minutes = 12345
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/park/duration/period`,
        method: 'POST',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
        body: { period: minutes },
      }

      window.api.request.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)
      retrieveToken.mockResolvedValueOnce(token)

      await parkForDuration(minutes)

      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('pause', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/pause`,
        method: 'POST',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      window.api.request.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)
      retrieveToken.mockResolvedValueOnce(token)

      await pause()

      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('start', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/start`,
        method: 'POST',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
      }

      window.api.request.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)
      retrieveToken.mockResolvedValueOnce(token)

      await startAndResume()

      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('startForDuration', () => {
    it('calls the mower API', async () => {
      const token = 'SuperSecureToken'
      const mowerId = 'MyMowerId'
      const minutes = 12345
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/start/override/period`,
        method: 'POST',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
        },
        body: { period: minutes },
      }

      window.api.request.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)
      retrieveToken.mockResolvedValueOnce(token)

      await startForDuration(minutes)

      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})