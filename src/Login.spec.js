import React from 'react'
import { mount } from 'enzyme'
import { Login } from './Login'
import { mockAppContext } from './testUtils'
import * as LoginService from './LoginService'

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
  it('Updates the form values on change', () => {
    const login = mount(<Login />)

    const email = 'someone@example.com'
    const password = 'super-secret'

    const loginView = new LoginViewHelper(login)

    loginView.editEmail(email)
    expect(loginView.getEmail()).toEqual(email)

    loginView.editPassword(password)
    expect(loginView.getPassword()).toEqual(password)
  })

  it('sends the request to login with the parameters', () => {
    const context = mockAppContext()
    const email = 'someone@example.com'

    const login = mount(<Login />)
    const loginView = new LoginViewHelper(login)

    loginView.editEmail(email)
    loginView.clickOnSubmit()

    const expectedCall = LoginService.login(email, '', expect.any(Function))
    expectedCall.onSuccess = expect.any(Function)

    expect(context.dispatch).toHaveBeenNthCalledWith(1, expectedCall)
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
})