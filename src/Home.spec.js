import React from 'react'
import { mount } from 'enzyme'
import {
  getMowerSettings,
  getMowerStatus,
  initializeMowerId,
  MowerActivity,
  MowerState,
  parkForDuration,
  parkUntilFurtherNotice,
  parkUntilNextStart,
  pause,
  startAndResume,
  startForDuration,
} from './MowerService'
import { Home } from './Home'
import { waitForUpdate } from './testUtils'

const mockTranslate = jest.fn()
jest.mock(
  'react-i18next',
  () => (
    {
      useTranslation: () => (
        { t: mockTranslate }
      ),
    }
  ),
)

jest.mock('./MowerService')

class HomeViewHelper {
  constructor(homeWrapper) {
    this.homeWrapper = homeWrapper
    this.refreshButtonSelector = '[data-refresh-button]'
    this.batteryLevelSelector = 'p[data-battery-level]'
    this.cuttingLevelSelector = 'p[data-cutting-level]'
    this.parkButtonSelector = '[data-park-button]'
    this.parkUntilFurtherNoticeMenuSelector = '[data-park-until-further-notice-menu]'
    this.parkUntilNextStartMenuSelector = '[data-park-until-next-start-menu]'
    this.parkForDurationMenuSelector = '[data-park-for-duration-menu]'
    this.durationDialogTypeSelector = '[data-duration-type] input'
    this.durationDialogInputSelector = '[data-duration-input] input'
    this.durationDialogModalSubmitSelector = '[data-duration-submit]'
    this.pauseButtonSelector = '[data-pause-button]'
    this.startButtonSelector = '[data-start-button]'
    this.startAndResumeMenuSelector = '[data-start-and-resume-menu]'
    this.startForDurationMenuSelector = '[data-start-for-duration-menu]'
  }

  refresh() {
    this.homeWrapper.find(this.refreshButtonSelector).at(0).simulate('click')
  }

  tapOnParkUntilFurtherNotice() {
    this.homeWrapper.find(this.parkButtonSelector).at(0).simulate('click')
    this.homeWrapper.find(this.parkUntilFurtherNoticeMenuSelector).at(0).simulate('click')
  }

  tapOnParkUntilNextStart() {
    this.homeWrapper.find(this.parkButtonSelector).at(0).simulate('click')
    this.homeWrapper.find(this.parkUntilNextStartMenuSelector).at(0).simulate('click')
  }

  tapOnPause() {
    this.homeWrapper.find(this.pauseButtonSelector).at(0).simulate('click')
  }

  tapOnStartAndResume() {
    this.homeWrapper.find(this.startButtonSelector).at(0).simulate('click')
    this.homeWrapper.find(this.startAndResumeMenuSelector).at(0).simulate('click')
  }

  tapOnParkForDurationForDays(days) {
    this.homeWrapper.find(this.parkButtonSelector).at(0).simulate('click')
    this.homeWrapper.find(this.parkForDurationMenuSelector).at(0).simulate('click')

    this.selectDaysDuration(days)
  }

  tapOnStartForDurationForDays(days) {
    this.homeWrapper.find(this.startButtonSelector).at(0).simulate('click')
    this.homeWrapper.find(this.startForDurationMenuSelector).at(0).simulate('click')

    this.selectDaysDuration(days)
  }

  selectDaysDuration(days) {
    this.homeWrapper.find(this.durationDialogTypeSelector).at(0).simulate('change', { target: { value: 'days' } })

    this.homeWrapper.find(this.durationDialogInputSelector).at(0).simulate('change', { target: { value: days } })

    this.homeWrapper.find(this.durationDialogModalSubmitSelector).at(0).simulate('click')
  }

  getBatteryLevel() {
    return this.homeWrapper.find(this.batteryLevelSelector).text()
  }

  getCuttingLevel() {
    return this.homeWrapper.find(this.cuttingLevelSelector).text()
  }
}

describe('Home', () => {
  beforeEach(() => {
    mockTranslate.mockReset()
    mockTranslate.mockReturnValue('Some translation happened')

    getMowerStatus.mockResolvedValue({})
    getMowerSettings.mockResolvedValue({})
    initializeMowerId.mockResolvedValue({})
  })

  it('Initializes the MowerService before retrieving data', async () => {
    initializeMowerId.mockReturnValue(new Promise(() => null))

    const home = mount(<Home />)

    await waitForUpdate(home)

    expect(initializeMowerId).toHaveBeenCalled()
    expect(getMowerStatus).not.toHaveBeenCalled()
    expect(getMowerSettings).not.toHaveBeenCalled()
  })

  it('Displays the battery level', async () => {
    getMowerStatus.mockResolvedValueOnce({ batteryLevel: 54 })

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(homeView.getBatteryLevel()).toBe('54')
  })

  it('Refreshes the mower details on refresh click', async () => {
    getMowerStatus.mockResolvedValueOnce({ batteryLevel: 54 })
    getMowerSettings.mockResolvedValueOnce({ cuttingLevel: 4 })

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(homeView.getBatteryLevel()).toBe('54')
    expect(homeView.getCuttingLevel()).toBe('4')

    getMowerStatus.mockResolvedValueOnce({ batteryLevel: 75 })
    getMowerSettings.mockResolvedValueOnce({ cuttingLevel: 1 })
    homeView.refresh()
    await waitForUpdate(home)

    expect(homeView.getBatteryLevel()).toBe('75')
    expect(homeView.getCuttingLevel()).toBe('1')
  })

  it('Displays the cutting level', async () => {
    getMowerStatus.mockResolvedValueOnce({})
    getMowerSettings.mockResolvedValueOnce({ cuttingLevel: 4 })

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(homeView.getCuttingLevel()).toBe('4')
  })

  it('Calls the parkUntilFurtherNotice method and refreshes', async () => {
    getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.MOWING })
    parkUntilFurtherNotice.mockResolvedValueOnce(null)

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(mockTranslate).toHaveBeenCalledWith('home.activity.mowing')

    getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.PARKED_IN_CS })
    await homeView.tapOnParkUntilFurtherNotice()

    await waitForUpdate(home)

    expect(parkUntilFurtherNotice).toHaveBeenCalled()
    expect(mockTranslate).toHaveBeenCalledWith('home.activity.parkedInCs')
  })

  it('Calls the parkUntilNextStart method and refreshes', async () => {
    getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.MOWING })
    parkUntilNextStart.mockResolvedValueOnce(null)

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(mockTranslate).toHaveBeenCalledWith('home.activity.mowing')

    getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.PARKED_IN_CS })
    await homeView.tapOnParkUntilNextStart()

    await waitForUpdate(home)

    expect(parkUntilNextStart).toHaveBeenCalled()
    expect(mockTranslate).toHaveBeenCalledWith('home.activity.parkedInCs')
  })

  describe('Calls the parkForDuration method and refreshes', () => {
    it('when selecting days', async () => {
      getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.MOWING })
      parkForDuration.mockResolvedValueOnce(null)

      const home = mount(<Home />)
      const homeView = new HomeViewHelper(home)
      const days = 6

      await waitForUpdate(home)

      expect(mockTranslate).toHaveBeenCalledWith('home.activity.mowing')

      getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.PARKED_IN_CS })
      await homeView.tapOnParkForDurationForDays(days)

      await waitForUpdate(home)

      expect(parkForDuration).toHaveBeenCalledWith(days * 24 * 60)
      expect(mockTranslate).toHaveBeenCalledWith('home.activity.parkedInCs')
    })
  })

  it('Calls the pause method and refreshes', async () => {
    getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.PARKED_IN_CS })
    pause.mockResolvedValueOnce(null)

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.STOPPED_IN_GARDEN })
    await homeView.tapOnPause()

    await waitForUpdate(home)

    expect(pause).toHaveBeenCalled()
  })

  it('Calls the startAndResume method and refreshes', async () => {
    getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.PARKED_IN_CS })
    startAndResume.mockResolvedValueOnce(null)

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.MOWING })
    await homeView.tapOnStartAndResume()

    await waitForUpdate(home)

    expect(startAndResume).toHaveBeenCalled()
  })

  describe('Calls the startForDuration method and refreshes', () => {
    it('when selecting days', async () => {
      getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.PARKED_IN_CS })
      startForDuration.mockResolvedValueOnce(null)

      const home = mount(<Home />)
      const homeView = new HomeViewHelper(home)
      const days = 6

      await waitForUpdate(home)

      getMowerStatus.mockResolvedValueOnce({ activity: MowerActivity.MOWING })
      await homeView.tapOnStartForDurationForDays(days)

      await waitForUpdate(home)

      expect(startForDuration).toHaveBeenCalledWith(days * 24 * 60)
    })
  })

  describe('Mower Activity', () => {
    const testActivity = async (activity, expectedDisplayActivity) => {
      getMowerStatus.mockResolvedValueOnce({ activity: activity })

      const home = mount(<Home />)

      await waitForUpdate(home)

      expect(mockTranslate).toHaveBeenCalledWith(`home.activity.label`)
      expect(mockTranslate).toHaveBeenCalledWith(`home.activity.${expectedDisplayActivity}`)
    }

    it('when activity is UNKNOWN', async () => {
      await testActivity(MowerActivity.UNKNOWN, 'unknown')
    })

    it('when activity is NOT_APPLICABLE', async () => {
      await testActivity(MowerActivity.NOT_APPLICABLE, 'notApplicable')
    })

    it('when activity is MOWING', async () => {
      await testActivity(MowerActivity.MOWING, 'mowing')
    })

    it('when activity is GOING_TO_CS', async () => {
      await testActivity(MowerActivity.GOING_TO_CS, 'goingToCs')
    })

    it('when activity is CHARGING', async () => {
      await testActivity(MowerActivity.CHARGING, 'charging')
    })

    it('when activity is LEAVING_CS', async () => {
      await testActivity(MowerActivity.LEAVING_CS, 'leavingCs')
    })

    it('when activity is PARKED_IN_CS', async () => {
      await testActivity(MowerActivity.PARKED_IN_CS, 'parkedInCs')
    })

    it('when activity is STOPPED_IN_GARDEN', async () => {
      await testActivity(MowerActivity.STOPPED_IN_GARDEN, 'stoppedInGarden')
    })
  })

  describe('Mower State', () => {
    const testState = async (state, expectedDisplayState) => {
      getMowerStatus.mockResolvedValueOnce({ state })

      const home = mount(<Home />)

      await waitForUpdate(home)

      expect(mockTranslate).toHaveBeenCalledWith(`home.state.label`)
      expect(mockTranslate).toHaveBeenCalledWith(`home.state.${expectedDisplayState}`)
    }

    it('when state is UNKNOWN', async () => {
      await testState(MowerState.UNKNOWN, 'unknown')
    })

    it('when state is NOT_APPLICABLE', async () => {
      await testState(MowerState.NOT_APPLICABLE, 'notApplicable')
    })

    it('when state is PAUSED', async () => {
      await testState(MowerState.PAUSED, 'paused')
    })

    it('when state is IN_OPERATION', async () => {
      await testState(MowerState.IN_OPERATION, 'inOperation')
    })

    it('when state is WAIT_UPDATING', async () => {
      await testState(MowerState.WAIT_UPDATING, 'waitUpdating')
    })

    it('when state is WAIT_POWER_UP', async () => {
      await testState(MowerState.WAIT_POWER_UP, 'waitPowerUp')
    })

    it('when state is RESTRICTED', async () => {
      await testState(MowerState.RESTRICTED, 'restricted')
    })

    it('when state is OFF', async () => {
      await testState(MowerState.OFF, 'off')
    })

    it('when state is STOPPED', async () => {
      await testState(MowerState.STOPPED, 'stopped')
    })

    it('when state is ERROR', async () => {
      await testState(MowerState.ERROR, 'error')
    })

    it('when state is FATAL_ERROR', async () => {
      await testState(MowerState.FATAL_ERROR, 'error')
    })

    it('when state is ERROR_AT_POWER_UP', async () => {
      await testState(MowerState.ERROR_AT_POWER_UP, 'error')
    })
  })
})