window.require = require
window.api = {
  secureStoreToken: jest.fn(),
  secureRetrieveToken: jest.fn(),
  secureDeleteToken: jest.fn(),
  request: jest.fn(),
}