import * as HomePage from '../page-objects/home.po'
import * as LoginPage from '../page-objects/login.po'
import * as SchedulePage from '../page-objects/schedule.po'

describe('Schedule', () => {
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
      await SchedulePage.waitForPageDisplayed()
    }
  })

  it('Can remove a schedule', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    const allScheduleCalls = await global.apiMockServer.retrieveRecordedRequests(
      '/app/v1/mowers/190415542-190332911/timers')

    await SchedulePage.goTo()
    expect(await SchedulePage.isVisible()).toBeTruthy()

    expect(await global.apiMockServer.verify(
      { method: 'GET', path: '/app/v1/mowers/190415542-190332911/timers' },
      allScheduleCalls.length + 1,
      allScheduleCalls.length + 1,
    ))

    await SchedulePage.tapOnEditButton()
    expect(await SchedulePage.isEditModeVisible()).toBeTruthy()

    expect(await global.apiMockServer.verify(
      { method: 'GET', path: '/app/v1/mowers/190415542-190332911/timers' },
      allScheduleCalls.length + 2,
      allScheduleCalls.length + 2,
    ))

    expect(await SchedulePage.getSchedulesCount()).toBe(1)
    await SchedulePage.tapOnDeleteButton()
    await SchedulePage.tapOnSaveButton()

    expect(await global.apiMockServer.verify(
      { method: 'PUT', path: '/app/v1/mowers/190415542-190332911/timers', body: { timers: [] } },
      allScheduleCalls.length + 1,
      allScheduleCalls.length + 1,
    ))

    expect(await global.apiMockServer.verify(
      { method: 'GET', path: '/app/v1/mowers/190415542-190332911/timers' },
      allScheduleCalls.length + 3,
      allScheduleCalls.length + 3,
    ))
  })
})