import { fetchAction } from './AppMiddleware'
import { deleteToken, storeToken } from './LoginRepository'

export const LoginError = {
  WRONG_LOGIN: 10,
  NO_NETWORK: 20,
  OTHER: 999,
}

Object.freeze(LoginError)

export const login = (email, password, onSuccess, onError) => fetchAction({
  url: 'https://iam-api.dss.husqvarnagroup.net/api/v3/token',
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
  onSuccess: response => storeToken(response.data.id).then(onSuccess),
  onError: error => {
    if (error.message === '400') {
      onError(LoginError.WRONG_LOGIN)
    } else if (error.message === 'Failed to fetch') {
      onError(LoginError.NO_NETWORK)
    } else {
      onError(LoginError.OTHER)
    }
  },
})

export const logout = onSuccess => {
  return deleteToken().then(onSuccess)
}