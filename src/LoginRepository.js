const { ipcRenderer } = window.require('electron')

export const storeToken = (token) => {
  return new Promise(((resolve, reject) => {
    ipcRenderer.on('store-token-result', (event) => resolve())
    ipcRenderer.send('store-token', token)
  }))
}

export const retrieveToken = async () => {
  return new Promise(((resolve, reject) => {
    ipcRenderer.on('retrieve-token-result', (event, token) => resolve(token))
    ipcRenderer.send('retrieve-token')
  }))
}

export const deleteToken = () => {
  return new Promise(((resolve, reject) => {
    ipcRenderer.on('delete-token-result', (event) => resolve())
    ipcRenderer.send('delete-token')
  }))
}