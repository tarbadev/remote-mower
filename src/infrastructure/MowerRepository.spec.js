import { getMowerId, storeMowerId } from './MowerRepository'

describe('MowerRepository', () => {
  describe('getMowerId', () => {
    it('asks for the settings mowerId', async () => {
      await getMowerId()

      expect(window.api.getSetting).toHaveBeenCalledWith('mower.id')
    })
  })

  describe('setMowerId',  () => {
    it('calls the main process', async () => {
      const mowerId = 'SuperId'

      await storeMowerId(mowerId)

      expect(window.api.setSetting).toHaveBeenCalledWith('mower.id', mowerId)
    })
  })
})