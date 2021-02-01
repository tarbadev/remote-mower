window.require = require
window.api = {
  secureStoreToken: jest.fn(),
  secureRetrieveToken: jest.fn(),
  secureDeleteToken: jest.fn(),
  secureStoreRefreshToken: jest.fn(),
  secureRetrieveRefreshToken: jest.fn(),
  secureDeleteRefreshToken: jest.fn(),
  request: jest.fn(),
  getSetting: jest.fn(),
  setSetting: jest.fn(),
}