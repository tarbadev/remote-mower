import { deleteToken, retrieveCredentials, retrieveToken, storeCredentials, storeToken } from './LoginRepository'

describe('LoginRepository', () => {
  describe('storeToken', () => {
    it('sends data to the main process', async () => {
      const token = 'SuperSecureToken'

      await storeToken(token)

      expect(window.api.secureStoreToken).toHaveBeenCalledWith(token)
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

  describe('deleteToken', () => {
    it('calls the main process', async () => {
      window.api.secureDeleteToken.mockResolvedValueOnce(undefined)

      await deleteToken()

      expect(window.api.secureDeleteToken).toHaveBeenCalled()
    })
  })

  describe('retrieveCredentials', () => {
    it('calls the main process', async () => {
      window.api.secureRetrieveCredentials.mockResolvedValueOnce(undefined)

      await retrieveCredentials()

      expect(window.api.secureRetrieveCredentials).toHaveBeenCalled()
    })
  })

  describe('storeCredentials', () => {
    it('calls the main process', async () => {
      const email = "SomeKindOfEmail"
      const password = "SuperSecurePassword"
      window.api.secureStoreCredentials.mockResolvedValueOnce(undefined)

      await storeCredentials(email, password)

      expect(window.api.secureStoreCredentials).toHaveBeenCalledWith(email, password)
    })
  })
})