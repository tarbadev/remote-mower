import { deleteToken, retrieveCredentials, storeCredentials, storeToken } from '../infrastructure/LoginRepository'
import RequestError from '../application/shared/RequestError'
import AppConfig from '../application/shared/app.config'

const { request } = window.api

export const LoginError = {
  WRONG_LOGIN: 10,
  NO_NETWORK: 20,
  OTHER: 999,
}

Object.freeze(LoginError)

const makeRequest = (options, onSuccess, onError) => {
  return request(options)
    .then(response => storeToken(response.data.id))
    .then(onSuccess)
    .catch(error => {
      if (error === 400) {
        onError(LoginError.WRONG_LOGIN)
      } else if (error === RequestError.NO_NETWORK) {
        onError(LoginError.NO_NETWORK)
      } else {
        onError(LoginError.OTHER)
      }
    })
}

export const login = async (email, password, onSuccess, onError) => {
  const requestOptions = {
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
  }

  return makeRequest(requestOptions, () => storeCredentials(email, password).then(onSuccess), onError)
}

export const logout = onSuccess => {
  return deleteToken().then(onSuccess)
}

export const refreshToken = async (onSuccess, onError = deleteToken) => {
  const { account, password } = await retrieveCredentials()
  return login(account, password, onSuccess, onError)
}