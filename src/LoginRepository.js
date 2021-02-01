const {
  secureStoreToken,
  secureRetrieveToken,
  secureDeleteToken,
  secureStoreRefreshToken,
  secureRetrieveRefreshToken,
  secureDeleteRefreshToken,
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

export const storeRefreshToken = token => {
  return secureStoreRefreshToken(token)
}

export const retrieveRefreshToken = () => {
  return secureRetrieveRefreshToken()
}

export const deleteRefreshToken = () => {
  return secureDeleteRefreshToken()
}