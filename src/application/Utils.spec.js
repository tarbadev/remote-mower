import { retrieveToken } from '../infrastructure/LoginRepository'
import { makeAuthenticatedRequest, makeRequest } from './Utils'
import { refreshToken } from '../domain/LoginService'

jest.mock('../infrastructure/LoginRepository')
jest.mock('../domain/LoginService')

describe('Utils', () => {
  describe('makeAuthenticatedRequest', () => {
    it('calls the window.api.request with the token and returns the response', async () => {
      const token = 'SuperSecureToken'
      const options = {
        url: 'https://example.com/foo/bar',
        method: 'GET',
        headers: { 'redirect': 'follow' },
      }
      const expectedRequestOptions = {
        url: 'https://example.com/foo/bar',
        method: 'GET',
        headers: {
          'Authorization-Provider': 'husqvarna',
          'x-system-validator': 'amc',
          'Authorization': `Bearer ${token}`,
          'redirect': 'follow',
        },
      }
      const response = { foo: 'bar' }

      window.api.request.mockResolvedValueOnce(response)
      retrieveToken.mockResolvedValueOnce(token)

      expect(await makeAuthenticatedRequest(options, false)).toEqual(response)

      expect(retrieveToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledWith(expectedRequestOptions)
    })
  })

  describe('makeRequest', () => {
    it('calls the window.api.request and returns the response', async () => {
      const options = {
        url: 'https://example.com/foo/bar',
        method: 'GET',
        headers: { 'redirect': 'follow' },
      }
      const response = { foo: 'bar' }

      window.api.request.mockResolvedValueOnce(response)

      expect(await makeRequest(options, false)).toEqual(response)

      expect(window.api.request).toHaveBeenCalledWith(options)
    })

    it('when refreshToken is true calls the window.api.request again and returns the response', async () => {
      const options = {
        url: 'https://example.com/foo/bar',
        method: 'GET',
        headers: { 'redirect': 'follow' },
      }
      const response = { foo: 'bar' }
      let called = false

      window.api.request.mockImplementation(() => {
        if (called) {
          return Promise.resolve(response)
        } else {
          called = true
          return Promise.reject(401)
        }
      })
      refreshToken.mockResolvedValueOnce()

      expect(await makeRequest(options, true)).toEqual(response)

      expect(refreshToken).toHaveBeenCalled()
      expect(window.api.request).toHaveBeenCalledTimes(2)
      expect(window.api.request).toHaveBeenCalledWith(options)
    })
  })
})