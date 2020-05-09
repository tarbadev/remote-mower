import React from 'react'
import { mount } from 'enzyme'
import { Home } from './Home'
import { mockAppContext } from './testUtils'
import { BrowserRouter } from 'react-router-dom'
import * as LoginService from './LoginService'
import { getMowerStatus, MowerActivity, MowerState } from './MowerService'

jest.mock('./MowerService')

const { act } = require('react-dom/test-utils')

class HomeViewHelper {
  constructor(homeWrapper) {
    this.homeWrapper = homeWrapper
    this.redirectSelector = 'Redirect'
    this.homeContainerSelector = '[data-home-container]'
    this.logoutButtonSelector = '[data-logout-button] button'
    this.batteryLevelSelector = 'p[data-battery-level]'
    this.mowerActivitySelector = 'span[data-mower-activity]'
    this.mowerStateSelector = 'span[data-mower-state]'
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
    this.homeWrapper.find(this.logoutButtonSelector).simulate('click')
  }

  getBatteryLevel() {
    return this.homeWrapper.find(this.batteryLevelSelector).text()
  }

  getMowerActivity() {
    return this.homeWrapper.find(this.mowerActivitySelector).text()
  }

  getMowerState() {
    return this.homeWrapper.find(this.mowerStateSelector).text()
  }
}

describe('Home', () => {
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
      expect(homeView.getMowerActivity()).toBe(expectedDisplayActivity)
    }

    it('when activity is UNKNOWN', async () => {
      await testActivity(MowerActivity.UNKNOWN, 'Unknown')
    })

    it('when activity is NOT_APPLICABLE', async () => {
      await testActivity(MowerActivity.NOT_APPLICABLE, 'Manual start required')
    })

    it('when activity is MOWING', async () => {
      await testActivity(MowerActivity.MOWING, 'Mowing')
    })

    it('when activity is GOING_TO_CS', async () => {
      await testActivity(MowerActivity.GOING_TO_CS, 'Going to Charging Station')
    })

    it('when activity is CHARGING', async () => {
      await testActivity(MowerActivity.CHARGING, 'Charging')
    })

    it('when activity is LEAVING_CS', async () => {
      await testActivity(MowerActivity.LEAVING_CS, 'Leaving Charging Station')
    })

    it('when activity is PARKED_IN_CS', async () => {
      await testActivity(MowerActivity.PARKED_IN_CS, 'Parked in Charging Station')
    })

    it('when activity is STOPPED_IN_GARDEN', async () => {
      await testActivity(MowerActivity.STOPPED_IN_GARDEN, 'Mower stopped. Manual action required')
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
      expect(homeView.getMowerState()).toBe(expectedDisplayState)
    }

    it('when state is UNKNOWN', async () => {
      await testState(MowerState.UNKNOWN, 'Unknown')
    })

    it('when state is NOT_APPLICABLE', async () => {
      await testState(MowerState.NOT_APPLICABLE, 'Not Applicable')
    })

    it('when state is PAUSED', async () => {
      await testState(MowerState.PAUSED, 'Paused')
    })

    it('when state is IN_OPERATION', async () => {
      await testState(MowerState.IN_OPERATION, 'In operation')
    })

    it('when state is WAIT_UPDATING', async () => {
      await testState(MowerState.WAIT_UPDATING, 'Downloading new firmware')
    })

    it('when state is WAIT_POWER_UP', async () => {
      await testState(MowerState.WAIT_POWER_UP, 'Performing power up tests')
    })

    it('when state is RESTRICTED', async () => {
      await testState(MowerState.RESTRICTED, 'Restricted: Cannot mow because because of week calendar or override park')
    })

    it('when state is OFF', async () => {
      await testState(MowerState.OFF, 'Mower turned off')
    })

    it('when state is STOPPED', async () => {
      await testState(MowerState.STOPPED, 'Mower stopped. Manual action required')
    })

    it('when state is ERROR', async () => {
      await testState(MowerState.ERROR, 'Error happened')
    })

    it('when state is FATAL_ERROR', async () => {
      await testState(MowerState.FATAL_ERROR, 'Error happened')
    })

    it('when state is ERROR_AT_POWER_UP', async () => {
      await testState(MowerState.ERROR_AT_POWER_UP, 'Error happened')
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