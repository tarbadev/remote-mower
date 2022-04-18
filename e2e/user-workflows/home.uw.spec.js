import * as HomePage from '../page-objects/home.po'
import * as LoginPage from '../page-objects/login.po'
import { getRequestCount, mockRequest, verifyUrlCalled } from '../wiremockHelpers'
import { loginIfNeeded } from '../loginHelper'
import { pause } from '../page-objects/helpers.po'

describe('Home', () => {
  beforeEach(async () => {
    await loginIfNeeded()
  })

  it('Removes the credentials from the store and displays login page on Logout', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await HomePage.logout()
    await LoginPage.waitForPageDisplayed()
    expect(await LoginPage.isVisible()).toBeTruthy()

    await browser.reloadSession()

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

    const allStatusCalls = await getRequestCount('/app/v1/mowers/190415542-190332911/status', 'GET')
    const allSettingsCalls = await getRequestCount('/app/v1/mowers/190415542-190332911/settings', 'GET')

    await HomePage.refresh()

    await pause(100)
    await verifyUrlCalled('/app/v1/mowers/190415542-190332911/status', 'GET', allStatusCalls + 1)
    await verifyUrlCalled('/app/v1/mowers/190415542-190332911/settings', 'GET', allSettingsCalls + 1)
  })

  it('Can park the mower until further notice', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await mockRequest('POST', {}, 200, '/app/v1/mowers/190415542-190332911/control/park')

    await HomePage.parkUntilFurtherNotice()

    await pause(100)
    await verifyUrlCalled(
      '/app/v1/mowers/190415542-190332911/control/park',
      'POST',
      1,
    )
  })

  it('Can park the mower until next scheduled run', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await mockRequest('POST', {}, 200, '/app/v1/mowers/190415542-190332911/control/park/duration/timer')

    await HomePage.parkUntilNextScheduledRun()

    await pause(100)
    await verifyUrlCalled(
      '/app/v1/mowers/190415542-190332911/control/park/duration/timer',
      'POST',
      1,
    )
  })

  it('Can park the mower for a given duration', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await mockRequest('POST', {}, 200, '/app/v1/mowers/190415542-190332911/control/park/duration/period')

    const hours = 6
    await HomePage.parkForDuration(hours)

    await verifyUrlCalled(
      '/app/v1/mowers/190415542-190332911/control/park/duration/period',
      'POST',
      1,
      { period: hours * 60 },
    )
  })

  it('Can pause the mower', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await mockRequest('POST', {}, 200, '/app/v1/mowers/190415542-190332911/control/pause')

    await HomePage.pause()

    await pause(100)
    await verifyUrlCalled(
      '/app/v1/mowers/190415542-190332911/control/pause',
      'POST',
      1,
    )
  })

  it('Can start the mower and resume main area', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await mockRequest('POST', {}, 200, '/app/v1/mowers/190415542-190332911/control/start')

    await HomePage.startAndResume()

    await pause(100)
    await verifyUrlCalled(
      '/app/v1/mowers/190415542-190332911/control/start',
      'POST',
      1,
    )
  })

  it('Can start the mower for a given duration overriding schedule', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    await mockRequest('POST', {}, 200, '/app/v1/mowers/190415542-190332911/control/start/override/period')

    const hours = 6
    await HomePage.startForDuration(hours)

    await pause(100)
    await verifyUrlCalled(
      '/app/v1/mowers/190415542-190332911/control/start/override/period',
      'POST',
      1,
      { period: hours * 60 },
    )
  })
})