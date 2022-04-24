import React from 'react'
import { mount } from 'enzyme'
import { Login } from './Login'
import { mockAppContext } from '../../../testUtils'
import * as LoginService from '../../../domain/LoginService'
import { LoginError } from '../../../domain/LoginService'

const mockTranslate = jest.fn()
jest.mock(
  'react-i18next',
  () => ({ useTranslation: () => ({ t: mockTranslate }) }),
)

class LoginViewHelper {
  constructor(loginContainer) {
    this.loginContainer = loginContainer
    this.emailSelector = '[data-email] input'
    this.passwordSelector = '[data-password] input'
    this.submitSelector = '[data-submit] button'
  }

  editEmail(email) {
    this.loginContainer.find(this.emailSelector).simulate('change', { target: { value: email } })
  }

  editPassword(password) {
    this.loginContainer.find(this.passwordSelector).simulate('change', { target: { value: password } })
  }

  getEmail() {
    return this.loginContainer.find(this.emailSelector).getDOMNode().getAttribute('value')
  }

  getPassword() {
    return this.loginContainer.find(this.passwordSelector).getDOMNode().attributes.getNamedItem('value').value
  }

  clickOnSubmit() {
    this.loginContainer.find(this.submitSelector).simulate('click')
  }
}

describe('Login', () => {
  beforeEach(() => {
    mockTranslate.mockReturnValue('Some translation happened')
  })

  it('Updates the form values on change', () => {
    const login = mount(<Login />)

    const email = 'someone@example.com'
    const password = 'super-secret'

    const loginView = new LoginViewHelper(login)

    loginView.editEmail(email)
    expect(loginView.getEmail()).toEqual(email)

    loginView.editPassword(password)
    expect(loginView.getPassword()).toEqual(password)

    expect(mockTranslate).toHaveBeenCalledWith('login.title')
    expect(mockTranslate).toHaveBeenCalledWith('login.emailLabel')
    expect(mockTranslate).toHaveBeenCalledWith('login.passwordLabel')
    expect(mockTranslate).toHaveBeenCalledWith('login.submitLabel')
  })

  it('sends the request to login with the parameters', () => {
    const email = 'someone@example.com'

    const login = mount(<Login />)
    const loginView = new LoginViewHelper(login)

    jest.spyOn(LoginService, 'login')

    loginView.editEmail(email)
    loginView.clickOnSubmit()

    expect(LoginService.login).toHaveBeenCalledWith(email, '', expect.any(Function), expect.any(Function))
  })

  it('redirects to home when login successful', () => {
    mockAppContext()
    const pushSpy = jest.fn()

    const login = mount(<Login history={{ push: pushSpy }} />)
    const loginView = new LoginViewHelper(login)

    jest
      .spyOn(LoginService, 'login')
      .mockImplementation((email, password, onSuccess) => onSuccess())

    loginView.clickOnSubmit()

    expect(pushSpy).toHaveBeenCalledWith('/')
  })

  describe('when login errors out', () => {
    it('displays a wrong login message when error is WRONG_LOGIN', () => {
      mockAppContext()
      const pushSpy = jest.fn()

      const login = mount(<Login history={{ push: pushSpy }} />)
      const loginView = new LoginViewHelper(login)

      jest
        .spyOn(LoginService, 'login')
        .mockImplementation((email, password, onSuccess, onError) => onError(LoginError.WRONG_LOGIN))

      loginView.clickOnSubmit()

      expect(mockTranslate).toHaveBeenCalledWith('login.error.wrongLogin')
    })

    it('displays a wrong login message when error is NO_NETWORK', () => {
      mockAppContext()
      const pushSpy = jest.fn()

      const login = mount(<Login history={{ push: pushSpy }} />)
      const loginView = new LoginViewHelper(login)

      jest
        .spyOn(LoginService, 'login')
        .mockImplementation((email, password, onSuccess, onError) => onError(LoginError.NO_NETWORK))

      loginView.clickOnSubmit()

      expect(mockTranslate).toHaveBeenCalledWith('login.error.networkIssue')
    })

    it('displays a wrong login message when error is OTHER', () => {
      mockAppContext()
      const pushSpy = jest.fn()

      const login = mount(<Login history={{ push: pushSpy }} />)
      const loginView = new LoginViewHelper(login)

      jest
        .spyOn(LoginService, 'login')
        .mockImplementation((email, password, onSuccess, onError) => onError(LoginError.OTHER))

      loginView.clickOnSubmit()

      expect(mockTranslate).toHaveBeenCalledWith('login.error.other')
    })
  })
})