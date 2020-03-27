import { fetchAction } from './AppMiddleware'

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
  onSuccess: onSuccess,
})