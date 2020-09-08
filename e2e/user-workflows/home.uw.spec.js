import * as HomePage from '../page-objects/home.po'
import * as LoginPage from '../page-objects/login.po'

describe('Home', () => {
  const email = process.env.E2E_EMAIL || 'test@example.com'
  const password = process.env.E2E_PASSWORD || 'SuperPassword'

  jest.setTimeout(15000)

  beforeEach(async () => {
    if (await LoginPage.isVisible()) {
      const body = {
        'data': {
          'id': 'c8498880-44a1-27c2-8b8c-100268e0bdab',
          'type': 'token',
          'attributes': {
            'expires_in': 863999,
            'refresh_token': '85c721b7-9298-4a87-9dea-f24364d01a07',
            'provider': 'husqvarna',
            'user_id': '5ca56609-44a0-4fd0-ae72-3370a16f7fb3',
            'scope': 'iam:read iam:write',
            'client_id': 'iam-password-client',
          },
        },
      }
      await global.apiMockServer.mockSimpleResponse('/api/v3/token', body, 200)

      await LoginPage.fillFormAndSubmit({ email, password })
      await HomePage.waitForPageDisplayed()
    }
  })

  it('Removes the credentials from the store and displays login page on Logout', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await HomePage.logout()
    await LoginPage.waitForPageDisplayed()
    expect(await LoginPage.isVisible()).toBeTruthy()

    await global.restart()
    expect(await LoginPage.isVisible()).toBeTruthy()
  }, 30000)

  it('Displays the mowers informations', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    expect(await HomePage.getBatteryLevel()).toBe('67')
    expect(await HomePage.getCuttingLevel()).toBe('6')
    expect(await HomePage.getMowerActivity()).toBe('Parked in Charging Station')
    expect(await HomePage.getMowerState())
        .toBe('Restricted: Cannot mow because because of week calendar or override park')
  })

  it('Refreshes the mowers informations', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    expect(await global.apiMockServer.verify(
        { method: 'GET', path: '/app/v1/mowers/190415542-190332911/status' },
        1,
        1,
    ))

    expect(await global.apiMockServer.verify(
        { method: 'GET', path: '/app/v1/mowers/190415542-190332911/settings' },
        1,
        1,
    ))

    await HomePage.refresh()

    expect(await global.apiMockServer.verify(
        { method: 'GET', path: '/app/v1/mowers/190415542-190332911/status' },
        2,
        2,
    ))

    expect(await global.apiMockServer.verify(
        { method: 'GET', path: '/app/v1/mowers/190415542-190332911/settings' },
        2,
        2,
    ))
  })
})