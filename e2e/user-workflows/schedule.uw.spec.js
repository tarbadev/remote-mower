import * as HomePage from '../page-objects/home.po'
import * as SchedulePage from '../page-objects/schedule.po'
import { getRequestCount, verifyUrlCalled } from '../wiremockHelpers'
import { loginIfNeeded } from '../loginHelper'
import { pause } from '../page-objects/helpers.po'

describe('Schedule', () => {
  beforeEach(async () => {
    await loginIfNeeded()
  })

  it('Can remove a schedule', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    const allGetCalls = await getRequestCount('/app/v1/mowers/190415542-190332911/timers', 'GET')
    const allPutCalls = await getRequestCount('/app/v1/mowers/190415542-190332911/timers', 'PUT')

    await SchedulePage.goTo()
    expect(await SchedulePage.isVisible()).toBeTruthy()

    await verifyUrlCalled('/app/v1/mowers/190415542-190332911/timers', 'GET', allGetCalls + 1)

    await SchedulePage.tapOnEditButton()
    expect(await SchedulePage.isEditModeVisible()).toBeTruthy()

    await verifyUrlCalled('/app/v1/mowers/190415542-190332911/timers', 'GET', allGetCalls + 2)

    expect(await SchedulePage.getSchedulesCount()).toBe(1)
    await SchedulePage.tapOnDeleteButton()
    await SchedulePage.tapOnSaveButton()

    await verifyUrlCalled('/app/v1/mowers/190415542-190332911/timers', 'PUT', allPutCalls + 1, { timers: [] })
    await verifyUrlCalled('/app/v1/mowers/190415542-190332911/timers', 'GET', allGetCalls + 3)
  })
})