import { deleteToken, retrieveToken, storeToken } from './LoginRepository'
import { ipcRenderer } from 'electron'

jest.mock(
  'electron',
  () => ({ ipcRenderer: { send: jest.fn(), on: jest.fn() } }),
)

describe('LoginRepository', () => {
  describe('storeToken', () => {
    it('sends data to the main process', async () => {
      const token = 'SuperSecureToken'

      ipcRenderer.on.mockImplementationOnce((channel, listener) => listener())

      await storeToken(token)

      expect(ipcRenderer.send).toHaveBeenCalledWith('store-token', token)
      expect(ipcRenderer.on).toHaveBeenCalledWith('store-token-result', expect.any(Function))
    })
  })

  describe('retrieveToken',  () => {
    it('calls the main process', async () => {
      const token = 'SuperSecureToken'

      ipcRenderer.on.mockImplementationOnce((channel, listener) => listener({}, token))

      expect(await retrieveToken()).toBe(token)

      expect(ipcRenderer.send).toHaveBeenCalledWith('retrieve-token')
      expect(ipcRenderer.on).toHaveBeenCalledWith('retrieve-token-result', expect.any(Function))
    })
  })

  describe('deleteToken',  () => {
    it('calls the main process', async () => {

      ipcRenderer.on.mockImplementationOnce((channel, listener) => listener())

      await deleteToken()

      expect(ipcRenderer.send).toHaveBeenCalledWith('delete-token')
      expect(ipcRenderer.on).toHaveBeenCalledWith('delete-token-result', expect.any(Function))
    })
  })
})