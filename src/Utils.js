export const request = (options) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  const defaults = { headers }
  const fetchOptions = {
    ...defaults,
    ...options,
  }

  return fetch(fetchOptions.url, fetchOptions).then((response) => {
    if (response.status >= 400) {
      throw new Error(response.status)
    }
    return response.json().then(json => json)
  })
}