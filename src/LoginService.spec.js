import { fetchAction } from './AppMiddleware'
import { login } from './LoginService'

describe('LoginService', () => {
  describe('login', () => {
    it('calls the login API', () => {
      const onSuccessSpy = jest.fn()
      const email = 'someone@example.com'
      const password = 'super-secret'

      expect(login(email, password, onSuccessSpy)).toEqual(fetchAction({
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
        onSuccess: onSuccessSpy,
      }))
    })
  })
})