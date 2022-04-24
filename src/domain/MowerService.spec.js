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
import { getMowerId, storeMowerId } from '../infrastructure/MowerRepository'
import AppConfig from '../application/shared/app.config'
import { makeAuthenticatedRequest } from '../application/Utils'

jest.mock('../infrastructure/MowerRepository')
jest.mock('../application/Utils')

describe('MowerService', () => {
  describe('initializeMowerId', () => {
    it('calls the mower API when the id is not stored already', async () => {
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers`,
        method: 'GET',
      }

      makeAuthenticatedRequest.mockResolvedValueOnce(mowersResponse)
      getMowerId.mockResolvedValueOnce(undefined)

      await initializeMowerId()

      expect(getMowerId).toHaveBeenCalled()
      expect(storeMowerId).toHaveBeenCalledWith('190415242-190632991')
      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })

    it('does not call the mower API when the id is already stored', async () => {
      getMowerId.mockResolvedValueOnce('190415242-190632991')

      await initializeMowerId()

      expect(storeMowerId).not.toHaveBeenCalled()
      expect(makeAuthenticatedRequest).not.toHaveBeenCalled()
    })
  })

  describe('getMowerStatus', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/status`,
        method: 'GET',
      }

      getMowerId.mockResolvedValueOnce(mowerId)
      makeAuthenticatedRequest.mockResolvedValueOnce(statusResponse)

      const expectedStatus = {
        batteryLevel: 67,
        activity: MowerActivity.PARKED_IN_CS,
        state: MowerState.RESTRICTED,
      }

      expect(await getMowerStatus()).toEqual(expectedStatus)

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('getMowerSettings', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/settings`,
        method: 'GET',
      }

      makeAuthenticatedRequest.mockResolvedValueOnce(settingsResponse)
      getMowerId.mockResolvedValueOnce(mowerId)

      const expectedSettings = {
        cuttingLevel: 7,
      }

      expect(await getMowerSettings()).toEqual(expectedSettings)

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('parkUntilFurtherNotice', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/park`,
        method: 'POST',
      }

      makeAuthenticatedRequest.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)

      await parkUntilFurtherNotice()

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('parkUntilNextStart', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/park/duration/timer`,
        method: 'POST',
      }

      makeAuthenticatedRequest.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)

      await parkUntilNextStart()

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('parkForDuration', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const minutes = 12345
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/park/duration/period`,
        method: 'POST',
        body: { period: minutes },
      }

      makeAuthenticatedRequest.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)

      await parkForDuration(minutes)

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('pause', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/pause`,
        method: 'POST',
      }

      makeAuthenticatedRequest.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)

      await pause()

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('start', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/start`,
        method: 'POST',
      }

      makeAuthenticatedRequest.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)

      await startAndResume()

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('startForDuration', () => {
    it('calls the mower API', async () => {
      const mowerId = 'MyMowerId'
      const minutes = 12345
      const expectedRequestOptions = {
        url: `${AppConfig.mowerApiUrl}/app/v1/mowers/${mowerId}/control/start/override/period`,
        method: 'POST',
        body: { period: minutes },
      }

      makeAuthenticatedRequest.mockResolvedValueOnce({})
      getMowerId.mockResolvedValueOnce(mowerId)

      await startForDuration(minutes)

      expect(makeAuthenticatedRequest).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })
})