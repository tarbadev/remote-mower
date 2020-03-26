import React from 'react'
import { mount } from 'enzyme'
import { Login } from './login'

class LoginViewHelper {
  constructor(loginContainer) {
    this.loginContainer = loginContainer
    this.emailSelector = '[data-email] input'
    this.passwordSelector = '[data-email] input'
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
}

describe('Login', () => {
  test('Updates the form values on change', () => {
    const login = mount(<Login />)

    const email = 'someone@example.com'
    const password = 'super-secret'

    const loginView = new LoginViewHelper(login)

    loginView.editEmail(email)
    expect(loginView.getEmail()).toEqual(email)

    loginView.editPassword(password)
    expect(loginView.getPassword()).toEqual(password)
  })
})