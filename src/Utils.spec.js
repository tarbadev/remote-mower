import { request } from './Utils'
import fetchMock from 'fetch-mock'

describe('request', () => {
  it('makes an api request with the given params', async () => {
    const mockedFetch = fetchMock.mock('/foo/bar', { success: true }, { overwriteRoutes: true })

    await request({
      url: '/foo/bar',
      method: 'post',
      body: JSON.stringify({ baz: 'biz' }),
    })

    const lastFetchOptions = mockedFetch.lastOptions()
    expect(JSON.parse(lastFetchOptions.body)).toEqual({ baz: 'biz' })
    expect(lastFetchOptions.headers).toEqual({ 'Content-Type': 'application/json', Accept: 'application/json' })
  })

  it('returns the result of the fetch when it succeeds', () => {
    fetchMock.mock('/foo/bar', { success: true }, { overwriteRoutes: true })
    return request({ url: '/foo/bar' }).then(result => expect(result).toEqual({ success: true }))
  })

  it('rejects the promise with an error when the response is an error', () => {
    fetchMock.mock('/foo/bar', 404, { overwriteRoutes: true })
    return request({ url: '/foo/bar' }).catch(e => expect(e.message).toEqual('404'))
  })
})
