import { fetchAction } from './AppMiddleware'
import { login, LoginError, logout } from './LoginService'
import { storeToken, deleteToken } from './LoginRepository'

jest.mock('./LoginRepository')

describe('LoginService', () => {
  describe('login', () => {
    it('calls the login API', () => {
      const email = 'someone@example.com'
      const password = 'super-secret'

      expect(login(email, password, jest.fn(), jest.fn())).toEqual(fetchAction({
        url: 'https://iam-api.dss.husqvarnagroup.net/api/v3/token',
        method: 'POST',
        body: {
          data: {
            type: "token",
            attributes: {
              username: email,
              password: password
            }
          }
        },
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }))
    })

    it('calls callback on success', async () => {
      const onSuccessSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'
      const data = {
        data: {
          id: "fdca6a6a-e973-4160-8684-7f30ae7cdda1",
          type: "token",
          attributes: {
            expires_in: 863999,
            refresh_token: "4bf3bfbb-24ed-4645-8fcf-b65c1d67921e",
            provider: "husqvarna",
            user_id: "8a9b70ee-5201-4f73-8ebd-97828524143f",
            scope: "iam:read iam:write",
            client_id: "iam-password-client"
          }
        }
      }

      let loginAction = login(email, password, onSuccessSpy)

      storeToken.mockResolvedValueOnce()
      await loginAction.onSuccess(data)

      expect(storeToken).toHaveBeenCalledWith(data.data.id)
      expect(onSuccessSpy).toHaveBeenCalled()
    })

    it('calls error callback on error with WRONG_LOGIN when error is 400',  () => {
      const onErrorSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'

      let loginAction = login(email, password, jest.fn(), onErrorSpy)

      loginAction.onError({ message: '400', stacktrace: 'some stack' })

      expect(onErrorSpy).toHaveBeenCalledWith(LoginError.WRONG_LOGIN)
    })

    it('calls error callback on error with NO_NETWORK when error is TypeError: Failed to fetch',  () => {
      const onErrorSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'

      let loginAction = login(email, password, jest.fn(), onErrorSpy)

      loginAction.onError({ message: 'Failed to fetch', stacktrace: 'some stack' })

      expect(onErrorSpy).toHaveBeenCalledWith(LoginError.NO_NETWORK)
    })

    it('calls error callback on error with OTHER when error is not known',  () => {
      const onErrorSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'

      let loginAction = login(email, password, jest.fn(), onErrorSpy)

      loginAction.onError({ message: 'No idea what this is!', stacktrace: 'some stack' })

      expect(onErrorSpy).toHaveBeenCalledWith(LoginError.OTHER)
    })
  })

  describe('logout', () => {
    it('deletes the token and calls the callback', async () => {
      const onSuccessSpy = jest.fn()

      deleteToken.mockResolvedValueOnce()

      await logout(onSuccessSpy)

      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })
})