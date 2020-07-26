import { deleteToken, storeToken } from './LoginRepository'
import RequestError from './shared/RequestError'
const { request } = window.api

export const LoginError = {
  WRONG_LOGIN: 10,
  NO_NETWORK: 20,
  OTHER: 999,
}

Object.freeze(LoginError)

export const login = async (email, password, onSuccess, onError) => {
  const requestOptions = {
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
  }
  return request(requestOptions)
    .then(response => storeToken(response.data.id).then(onSuccess))
    .catch(error => {
      if (error === '400') {
        onError(LoginError.WRONG_LOGIN)
      } else if (error === RequestError.NO_NETWORK) {
        onError(LoginError.NO_NETWORK)
      } else {
        onError(LoginError.OTHER)
      }
    })
}

export const logout = onSuccess => {
  return deleteToken().then(onSuccess)
}