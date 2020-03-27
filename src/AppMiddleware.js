import { request } from './Utils'
import match from 'conditional-expression'

export const FETCH = 'FETCH'

export const fetchAction = ({
  url, method, body, onSuccess, onError,
}) => ({
  type: FETCH,
  url,
  method,
  body,
  onSuccess,
  onError,
})

export const applyMiddleware = dispatch => action =>
  dispatch(action) ||
  match(action.type)
    .equals(FETCH).then(() => {
      const requestOptions = {
        url: action.url,
        method: action.method,
      }

      if (action.method === 'POST' || action.method === 'PUT' || action.method === 'PATCH') {
        requestOptions.body = JSON.stringify(action.body)
      }

      request(requestOptions)
        .then(data => action.onSuccess(data))
        .catch(error => action.onError && action.onError(error))
    })
    .else(null)