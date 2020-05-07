import { fetchAction } from './AppMiddleware'
import { deleteToken, storeToken } from './LoginRepository'

export const login = (email, password, onSuccess) => fetchAction({
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
  onSuccess: response => onLoginSuccess(response, onSuccess),
})

const onLoginSuccess = (response, onSuccess) => {
  return storeToken(response.data.id).then(onSuccess)
}

export const logout = onSuccess => {
  return deleteToken().then(onSuccess)
}