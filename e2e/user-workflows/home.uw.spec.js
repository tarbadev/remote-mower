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

    const allStatusCalls = await global.apiMockServer.retrieveRecordedRequests(
      '/app/v1/mowers/190415542-190332911/status')
    const allSettingsCalls = await global.apiMockServer.retrieveRecordedRequests(
      '/app/v1/mowers/190415542-190332911/settings')

    await HomePage.refresh()

    expect(await global.apiMockServer.verify(
      { method: 'GET', path: '/app/v1/mowers/190415542-190332911/status' },
      allStatusCalls.length + 1,
      allStatusCalls.length + 1,
    ))

    expect(await global.apiMockServer.verify(
      { method: 'GET', path: '/app/v1/mowers/190415542-190332911/settings' },
      allStatusCalls.length + 1,
      allSettingsCalls.length + 1,
    ))
  })

  it('Can park the mower until further notice', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await global.apiMockServer.mockSimpleResponse('/app/v1/mowers/190415542-190332911/control/park', {}, 200)

    const allCalls = await global.apiMockServer.retrieveRecordedRequests(
      '/app/v1/mowers/190415542-190332911/control/park')
    await HomePage.parkUntilFurtherNotice()

    expect(await global.apiMockServer.verify(
      { method: 'POST', path: '/app/v1/mowers/190415542-190332911/control/park' },
      allCalls.length + 1,
      allCalls.length + 1,
    ))
  })

  it('Can park the mower until next scheduled run', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await global.apiMockServer.mockSimpleResponse('/app/v1/mowers/190415542-190332911/control/park/duration/timer',
      {},
      200)

    const allCalls = await global.apiMockServer.retrieveRecordedRequests(
      '/app/v1/mowers/190415542-190332911/control/park/duration/timer')
    await HomePage.parkUntilNextScheduledRun()

    expect(await global.apiMockServer.verify(
      { method: 'POST', path: '/app/v1/mowers/190415542-190332911/control/park/duration/timer' },
      allCalls.length + 1,
      allCalls.length + 1,
    ))
  })

  it('Can park the mower for a given duration', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await global.apiMockServer.mockSimpleResponse('/app/v1/mowers/190415542-190332911/control/park/duration/period',
      {},
      200)

    const allCalls = await global.apiMockServer.retrieveRecordedRequests(
      '/app/v1/mowers/190415542-190332911/control/park/duration/period')

    const hours = 6
    await HomePage.parkForDuration(hours)

    expect(await global.apiMockServer.verify(
      {
        method: 'POST',
        path: '/app/v1/mowers/190415542-190332911/control/park/duration/period',
        body: { period: hours * 60 },
      },
      allCalls.length + 1,
      allCalls.length + 1,
    ))
  })

  it('Can pause the mower', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await global.apiMockServer.mockSimpleResponse('/app/v1/mowers/190415542-190332911/control/pause',
      {},
      200)

    const allCalls = await global.apiMockServer.retrieveRecordedRequests(
      '/app/v1/mowers/190415542-190332911/control/pause')

    await HomePage.pause()

    expect(await global.apiMockServer.verify(
      {
        method: 'POST',
        path: '/app/v1/mowers/190415542-190332911/control/pause',
      },
      allCalls.length + 1,
      allCalls.length + 1,
    ))
  })

  it('Can start the mower and resume main area', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await global.apiMockServer.mockSimpleResponse('/app/v1/mowers/190415542-190332911/control/start',
      {},
      200)

    const allCalls = await global.apiMockServer.retrieveRecordedRequests(
      '/app/v1/mowers/190415542-190332911/control/start')

    await HomePage.startAndResume()

    expect(await global.apiMockServer.verify(
      {
        method: 'POST',
        path: '/app/v1/mowers/190415542-190332911/control/start',
      },
      allCalls.length + 1,
      allCalls.length + 1,
    ))
  })

  it('Can start the mower for a given duration overriding schedule', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await global.apiMockServer.mockSimpleResponse('/app/v1/mowers/190415542-190332911/control/start/override/period',
      {},
      200)

    const allCalls = await global.apiMockServer.retrieveRecordedRequests(
      '/app/v1/mowers/190415542-190332911/control/start/override/period')

    const hours = 6
    await HomePage.startForDuration(hours)

    expect(await global.apiMockServer.verify(
      {
        method: 'POST',
        path: '/app/v1/mowers/190415542-190332911/control/start/override/period',
        body: { period: hours * 60 },
      },
      allCalls.length + 1,
      allCalls.length + 1,
    ))
  })
})