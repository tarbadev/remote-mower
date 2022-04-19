window.require = require
window.api = {
  secureStoreToken: jest.fn(),
  secureRetrieveToken: jest.fn(),
  secureDeleteToken: jest.fn(),
  secureRetrieveCredentials: jest.fn(),
  secureStoreCredentials: jest.fn(),
  request: jest.fn(),
  getSetting: jest.fn(),
  setSetting: jest.fn(),
}