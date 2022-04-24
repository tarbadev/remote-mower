import { login, LoginError, logout, refreshToken } from './LoginService'
import { deleteToken, retrieveCredentials, storeCredentials, storeToken } from '../infrastructure/LoginRepository'
import RequestError from '../application/shared/RequestError'
import AppConfig from '../application/shared/app.config'

jest.mock('./LoginRepository')

describe('LoginService', () => {
  describe('login', () => {
    it('calls the login API', async () => {
      const onSuccessSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'
      const data = {
        data: {
          id: 'fdca6a6a-e973-4160-8684-7f30ae7cdda1',
          type: 'token',
          attributes: {
            expires_in: 863999,
            refresh_token: '4bf3bfbb-24ed-4645-8fcf-b65c1d67921e',
            provider: 'husqvarna',
            user_id: '8a9b70ee-5201-4f73-8ebd-97828524143f',
            scope: 'iam:read iam:write',
            client_id: 'iam-password-client',
          },
        },
      }

      window.api.request.mockResolvedValueOnce(data)
      storeToken.mockResolvedValueOnce()
      storeCredentials.mockResolvedValueOnce()

      await login(email, password, onSuccessSpy)

      expect(window.api.request).toHaveBeenCalledWith({
        url: `${AppConfig.loginApiUrl}/api/v3/token`,
        method: 'POST',
        body: {
          data: {
            type: 'token',
            attributes: {
              username: email,
              password: password,
            },
          },
        },
      })

      expect(storeToken).toHaveBeenCalledWith(data.data.id)
      expect(storeCredentials).toHaveBeenCalledWith(email, password)
      expect(onSuccessSpy).toHaveBeenCalled()
    })

    it('calls error callback on error with WRONG_LOGIN when error is 400', async () => {
      const onErrorSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'

      window.api.request.mockRejectedValue(400)

      await login(email, password, jest.fn(), onErrorSpy)

      expect(onErrorSpy).toHaveBeenCalledWith(LoginError.WRONG_LOGIN)
    })

    it('calls error callback on error with NO_NETWORK when error is NO_NETWORK', async () => {
      const onErrorSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'

      window.api.request.mockRejectedValue(RequestError.NO_NETWORK)

      await login(email, password, jest.fn(), onErrorSpy)

      expect(onErrorSpy).toHaveBeenCalledWith(LoginError.NO_NETWORK)
    })

    it('calls error callback on error with OTHER when error is not known', async () => {
      const onErrorSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'

      window.api.request.mockRejectedValue(401)

      await login(email, password, jest.fn(), onErrorSpy)

      expect(onErrorSpy).toHaveBeenCalledWith(LoginError.OTHER)
    })
  })

  describe('logout', () => {
    it('deletes the token and calls the callback', async () => {
      const onSuccessSpy = jest.fn()

      deleteToken.mockResolvedValueOnce()

      await logout(onSuccessSpy)

      expect(onSuccessSpy).toHaveBeenCalled()
      expect(deleteToken).toHaveBeenCalled()
    })
  })

  describe('refreshToken', () => {
    it('retrieves the credentials and calls the login API', async () => {
      const onSuccessSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'
      const data = {
        data: {
          id: 'fdca6a6a-e973-4160-8684-7f30ae7cdda1',
          type: 'token',
          attributes: {
            expires_in: 863999,
            refresh_token: '4bf3bfbb-24ed-4645-8fcf-b65c1d67921e',
            provider: 'husqvarna',
            user_id: '8a9b70ee-5201-4f73-8ebd-97828524143f',
            scope: 'iam:read iam:write',
            client_id: 'iam-password-client',
          },
        },
      }

      window.api.request.mockResolvedValueOnce(data)
      retrieveCredentials.mockResolvedValueOnce({ account: email, password })
      storeCredentials.mockResolvedValueOnce()

      await refreshToken(onSuccessSpy)

      expect(window.api.request).toHaveBeenCalledWith({
        url: `${AppConfig.loginApiUrl}/api/v3/token`,
        method: 'POST',
        body: {
          data: {
            type: 'token',
            attributes: {
              username: email,
              password: password,
            },
          },
        },
      })

      expect(storeToken).toHaveBeenCalledWith(data.data.id)
      expect(retrieveCredentials).toHaveBeenCalled()
      expect(onSuccessSpy).toHaveBeenCalled()
    })

    it('calls error callback on error with WRONG_LOGIN when error is 400', async () => {
      const onErrorSpy = jest.fn()

      retrieveCredentials.mockResolvedValueOnce({})

      window.api.request.mockRejectedValue(400)

      await refreshToken(jest.fn(), onErrorSpy)

      expect(onErrorSpy).toHaveBeenCalledWith(LoginError.WRONG_LOGIN)
    })

    it('calls error callback on error with NO_NETWORK when error is NO_NETWORK', async () => {
      const onErrorSpy = jest.fn()

      retrieveCredentials.mockResolvedValueOnce({})

      window.api.request.mockRejectedValue(RequestError.NO_NETWORK)

      await refreshToken(jest.fn(), onErrorSpy)

      expect(onErrorSpy).toHaveBeenCalledWith(LoginError.NO_NETWORK)
    })

    it('calls error callback on error with OTHER when error is not known', async () => {
      const onErrorSpy = jest.fn()

      retrieveCredentials.mockResolvedValueOnce({})

      window.api.request.mockRejectedValue(401)

      await refreshToken(jest.fn(), onErrorSpy)

      expect(onErrorSpy).toHaveBeenCalledWith(LoginError.OTHER)
    })
  })
})