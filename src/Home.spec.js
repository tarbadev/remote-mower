import React from 'react'
import { mount } from 'enzyme'
import { Home } from './Home'
import { mockAppContext } from './testUtils'
import { BrowserRouter } from 'react-router-dom'
import * as LoginService from './LoginService'
import { getBatteryLevel} from './MowerService'

jest.mock('./MowerService')

const { act } = require('react-dom/test-utils')

class HomeViewHelper {
  constructor(homeWrapper) {
    this.homeWrapper = homeWrapper
    this.redirectSelector = 'Redirect'
    this.homeContainerSelector = '[data-home-container]'
    this.logoutButtonSelector = '[data-logout-button] button'
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
    this.homeWrapper.find(this.logoutButtonSelector).simulate('click')
  }

  getBatteryLevel() {
    return this.homeWrapper.find(this.batteryLevelSelector).text()
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
    getBatteryLevel.mockResolvedValueOnce(54)

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(homeView.isRedirectingToLoginPage()).toBeFalsy()
    expect(homeView.isVisible()).toBeTruthy()
  })

  it('Redirects to login page when logging out', async () => {
    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(true)
    getBatteryLevel.mockResolvedValueOnce(54)

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
    getBatteryLevel.mockResolvedValueOnce(54)

    const home = mount(<Home />)
    const homeView = new HomeViewHelper(home)

    await waitForUpdate(home)

    expect(homeView.isVisible()).toBeTruthy()
    expect(homeView.getBatteryLevel()).toBe('54')
  })
})

async function waitForUpdate(home) {
  await act(async () => {
    await Promise.resolve(home)
    await new Promise(resolve => setImmediate(resolve))
    home.update()
  })
}