import React from 'react'
import { mount } from 'enzyme'
import { ConnectedUserContent } from './ConnectedUserContent'
import { mockAppContext, waitForUpdate } from './testUtils'
import { BrowserRouter } from 'react-router-dom'
import * as LoginService from './LoginService'

const { act } = require('react-dom/test-utils')

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

class ConnectedUserContentViewHelper {
  constructor(viewWrapper) {
    this.viewWrapper = viewWrapper
    this.redirectSelector = 'Redirect'
    this.connectedUserContentContainerSelector = '[data-connected-user-container]'
    this.logoutButtonSelector = '[data-logout-button]'
  }

  isRedirectingToLoginPage() {
    const redirectFinder = this.viewWrapper.find(this.redirectSelector)
    if (redirectFinder.length === 0) {
      return false
    }

    return redirectFinder.prop('to') === '/login'
  }

  isVisible() {
    return this.viewWrapper.find(this.connectedUserContentContainerSelector).length >= 1
  }

  logout() {
    this.viewWrapper.find(this.logoutButtonSelector).at(0).simulate('click')
  }
}

const mountWithRouter = (component) => mount(<BrowserRouter>{component}</BrowserRouter>)

describe('ConnectedUserContent', () => {
  beforeEach(() => {
    mockTranslate.mockReset()
    mockTranslate.mockReturnValue('Some translation happened')
  })

  it('Displays nothing when initializing', async () => {
    mockAppContext()

    const connectedUserContent = mountWithRouter(<ConnectedUserContent />)
    const connectedUserContentView = new ConnectedUserContentViewHelper(connectedUserContent)

    expect(connectedUserContentView.isRedirectingToLoginPage()).toBeFalsy()
    expect(connectedUserContentView.isVisible()).toBeFalsy()
  })

  it('Redirects to login page when user is not logged in', async () => {
    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(false)

    const connectedUserContent = mountWithRouter(<ConnectedUserContent />)
    const connectedUserContentView = new ConnectedUserContentViewHelper(connectedUserContent)

    await waitForUpdate(connectedUserContent)

    expect(connectedUserContentView.isRedirectingToLoginPage()).toBeTruthy()
    expect(connectedUserContentView.isVisible()).toBeFalsy()
  })

  it('Displays page when user is logged in', async () => {
    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(true)

    const connectedUserContent = mountWithRouter(<ConnectedUserContent />)
    const connectedUserContentView = new ConnectedUserContentViewHelper(connectedUserContent)

    await waitForUpdate(connectedUserContent)

    expect(connectedUserContentView.isRedirectingToLoginPage()).toBeFalsy()
    expect(connectedUserContentView.isVisible()).toBeTruthy()
  })

  it('Redirects to login page when logging out', async () => {
    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(true)

    const connectedUserContent = mountWithRouter(<ConnectedUserContent />)
    const connectedUserContentView = new ConnectedUserContentViewHelper(connectedUserContent)

    await waitForUpdate(connectedUserContent)

    jest
      .spyOn(LoginService, 'logout')
      .mockImplementation(onSuccess => onSuccess())

    mockAppContext().isUserLoggedIn.mockResolvedValueOnce(false)
    await act(async () => {
      connectedUserContentView.logout()
    })
    await waitForUpdate(connectedUserContent)

    expect(connectedUserContentView.isRedirectingToLoginPage()).toBeTruthy()
    expect(connectedUserContentView.isVisible()).toBeFalsy()

    expect(mockTranslate).toHaveBeenCalledWith('drawer.logout')
  })
})