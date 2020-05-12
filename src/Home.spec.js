import React from 'react'
import { mount } from 'enzyme'
import { Home } from './Home'
import { mockAppContext } from './testUtils'
import { BrowserRouter } from 'react-router-dom'
import * as LoginService from './LoginService'
import { getMowerStatus, MowerActivity, MowerState } from './MowerService'

const { act } = require('react-dom/test-utils')

const mockTranslate = jest.fn()
jest.mock(
  'react-i18next',
  () => ({ useTranslation: () => ({ t: mockTranslate }) }),
)

jest.mock('./MowerService')

class HomeViewHelper {
  constructor(homeWrapper) {
    this.homeWrapper = homeWrapper
    this.redirectSelector = 'Redirect'
    this.homeContainerSelector = '[data-home-container]'
    this.logoutButtonSelector = '[data-logout-button]'
    this.batteryLevelSelector = 'p[data-battery-level]'
  }

  isRedirectingToLoginPage() {
    const redirectFinder = this.homeWrapper.find(this.redirectSelector)
    if (redirectFinder.length === 0) {
      return false
    }

    return redirectFinder.prop('to') === '/login'
  }

  isVisible() {
    return this.homeWrapper.find(this.homeContainerSelector).length >= 1
  }

  logout() {
    this.homeWrapper.find(this.logoutButtonSelector).at(0).simulate('click')
  }

  getBatteryLevel() {
    return this.homeWrapper.find(this.batteryLevelSelector).text()
  }
}

describe('Home', () => {
  beforeEach(() => {
    mockTranslate.mockReset()
    mockTranslate.mockReturnValue('Some translation happened')
  })

  it('Displays nothing when initializing', async () => {
    mockAppContext()

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    expect(homeView.isRedirectingToLoginPage()).toBeFalsy()
    expect(homeView.isVisible()).toBeFalsy()
  })

  it('Redirects to login page when user is not logged in', async () => {
    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(false)

    const home = mount(<BrowserRouter><Home /></BrowserRouter>)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(homeView.isRedirectingToLoginPage()).toBeTruthy()
    expect(homeView.isVisible()).toBeFalsy()
  })

  it('Displays home page when user is logged in', async () => {
    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(true)
    getMowerStatus.mockResolvedValueOnce(54)

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(homeView.isRedirectingToLoginPage()).toBeFalsy()
    expect(homeView.isVisible()).toBeTruthy()
  })

  it('Redirects to login page when logging out', async () => {
    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(true)
    getMowerStatus.mockResolvedValueOnce(54)

    const home = mount(<BrowserRouter><Home /></BrowserRouter>)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    jest
      .spyOn(LoginService, 'logout')
      .mockImplementation(onSuccess => onSuccess())

    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(false)
    await act(async () => {
      homeView.logout()
    })
    await waitForUpdate(home)

    expect(homeView.isRedirectingToLoginPage()).toBeTruthy()
    expect(homeView.isVisible()).toBeFalsy()

    expect(mockTranslate).toHaveBeenCalledWith('home.logoutLabel')
  })

  it('Displays the battery level', async () => {
    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(true)
    getMowerStatus.mockResolvedValueOnce({ batteryLevel: 54 })

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(homeView.isVisible()).toBeTruthy()
    expect(homeView.getBatteryLevel()).toBe('54')
  })

  describe('Mower Activity', () => {
    const testActivity = async (activity, expectedDisplayActivity) => {
      mockAppContext().isUserLoggedIn.mockResolvedValueOnce(true)
      getMowerStatus.mockResolvedValueOnce({ activity: activity })

      const home = mount(<Home />)
      const homeView = new HomeViewHelper(home)

      await waitForUpdate(home)

      expect(homeView.isVisible()).toBeTruthy()

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
      mockAppContext().isUserLoggedIn.mockResolvedValueOnce(true)
      getMowerStatus.mockResolvedValueOnce({ state })

      const home = mount(<Home />)
      const homeView = new HomeViewHelper(home)

      await waitForUpdate(home)

      expect(homeView.isVisible()).toBeTruthy()
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

async function waitForUpdate(home) {
  await act(async () => {
    await Promise.resolve(home)
    await new Promise(resolve => setImmediate(resolve))
    home.update()
  })
}