import nodeFetch from 'node-fetch'

const baseUrl = 'http://localhost:8080/__admin'

export const mockRequest = (method, responseBody, status, url) => {
  const body = JSON.stringify({
    request: {
      method,
      url,
    },
    response: {
      status: status,
      jsonBody: responseBody,
    },
  })

  return nodeFetch(`${baseUrl}/mappings/new`, { method, body })
}

export const mockTokenRequest = (responseBody, status) => {
  return mockRequest('POST', responseBody, status, '/api/v3/token')
}

export const mockValidTokenRequest = () => {
  return mockTokenRequest({
    data: {
      id: 'c8498880-44a1-27c2-8b8c-100268e0bdab',
      type: 'token',
      attributes: {
        expires_in: 863999,
        refresh_token: '85c721b7-9298-4a87-9dea-f24364d01a07',
        provider: 'husqvarna',
        user_id: '5ca56609-44a0-4fd0-ae72-3370a16f7fb3',
        scope: 'iam:read iam:write',
        client_id: 'iam-password-client',
      },
    },
  }, 200)
}

export const getRequestCount = async (url, method, bodyMatcher) => {
  const body = { method, url }

  if (bodyMatcher) {
    body.bodyPatterns = [{ equalToJson: JSON.stringify(bodyMatcher) }]
  }

  const response = await nodeFetch(
    `${baseUrl}/requests/count`,
    { method: 'POST', body: JSON.stringify(body) })
    .then(res => res.json())

  return response.count
}

export const verifyUrlCalled = async (url, method, expectedCount, expectedBody) => {
  const count = await getRequestCount(url, method, expectedBody)

  expect(count).toEqual(expectedCount)
}