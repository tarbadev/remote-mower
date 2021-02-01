import {
  deleteRefreshToken,
  deleteToken,
  retrieveRefreshToken,
  retrieveToken,
  storeRefreshToken,
  storeToken,
} from './LoginRepository'

describe('LoginRepository', () => {
  describe('storeToken', () => {
    it('sends data to the main process', async () => {
      const token = 'SuperSecureToken'

      await storeToken(token)

      expect(window.api.secureStoreToken).toHaveBeenCalledWith(token)
    })
  })

  describe('storeRefreshToken', () => {
    it('sends data to the main process', async () => {
      const RefreshToken = 'SuperSecureRefreshToken'

      await storeRefreshToken(RefreshToken)

      expect(window.api.secureStoreRefreshToken).toHaveBeenCalledWith(RefreshToken)
    })
  })

  describe('retrieveToken', () => {
    it('calls the main process', async () => {
      const token = 'SuperSecureToken'

      window.api.secureRetrieveToken.mockResolvedValueOnce(token)

      expect(await retrieveToken()).toBe(token)

      expect(window.api.secureRetrieveToken).toHaveBeenCalled()
    })
  })

  describe('retrieveRefreshToken', () => {
    it('calls the main process', async () => {
      const token = 'SuperSecureRefreshToken'

      window.api.secureRetrieveRefreshToken.mockResolvedValueOnce(token)

      expect(await retrieveRefreshToken()).toBe(token)

      expect(window.api.secureRetrieveRefreshToken).toHaveBeenCalled()
    })
  })

  describe('deleteToken', () => {
    it('calls the main process', async () => {
      window.api.secureDeleteToken.mockResolvedValueOnce(undefined)

      await deleteToken()

      expect(window.api.secureDeleteToken).toHaveBeenCalled()
    })
  })

  describe('deleteRefreshToken', () => {
    it('calls the main process', async () => {
      window.api.secureDeleteRefreshToken.mockResolvedValueOnce(undefined)

      await deleteRefreshToken()

      expect(window.api.secureDeleteRefreshToken).toHaveBeenCalled()
    })
  })
})