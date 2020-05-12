const { secureStoreToken, secureRetrieveToken, secureDeleteToken } = window.api

export const storeToken = token => {
  return secureStoreToken(token)
}

export const retrieveToken = () => {
  return secureRetrieveToken()
}

export const deleteToken = () => {
  return secureDeleteToken()
}