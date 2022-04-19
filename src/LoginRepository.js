const {
  secureStoreToken,
  secureRetrieveToken,
  secureDeleteToken,
  secureRetrieveCredentials,
  secureStoreCredentials,
} = window.api

export const storeToken = token => {
  return secureStoreToken(token)
}

export const retrieveToken = () => {
  return secureRetrieveToken()
}

export const deleteToken = () => {
  return secureDeleteToken()
}

export const retrieveCredentials = () => {
  return secureRetrieveCredentials()
}

export const storeCredentials = (email, password) => {
  return secureStoreCredentials(email, password)
}