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

  it('Displays the battery level', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    expect(await HomePage.getBatteryLevel()).toBe('67')
  })

  it('Displays the mower activity', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    expect(await HomePage.getMowerActivity()).toBe('Parked in Charging Station')
  })

  it('Displays the mower state', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    expect(await HomePage.getMowerState())
      .toBe('Restricted: Cannot mow because because of week calendar or override park')
  })

  it('Removes the credentials from the store and displays login page on Logout', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await HomePage.logout()
    await LoginPage.waitForPageDisplayed()
    console.log('LoginPage.isVisible')
    expect(await LoginPage.isVisible()).toBeTruthy()

    console.log('Restart')
    await global.restart()
    console.log('LoginPage.isVisible')
    expect(await LoginPage.isVisible()).toBeTruthy()
    console.log('End')
  }, 30000)
})