import * as LoginPage from '../page-objects/login.po'
import * as HomePage from '../page-objects/home.po'
import { mockTokenRequest, mockValidTokenRequest } from '../wiremockHelpers'
import { pause } from '../page-objects/helpers.po'

describe('Login', () => {
  const email = 'some.email@remotemower.com'
  const password = 'SomeSuperSecurePassword'

  beforeAll(async () => {
    if (await HomePage.isVisible()) {
      await HomePage.logout()
      await LoginPage.waitForPageDisplayed()
    }
  })

  it('Displays an error message on login failure', async () => {
    expect(await LoginPage.isVisible()).toBeTruthy()

    await mockTokenRequest({}, 400)

    await LoginPage.fillFormAndSubmit({ email: 'test', password: 'somethingwrong' })

    await LoginPage.waitForErrorMessageDisplayed()
    await pause(100)
    expect(await LoginPage.isErrorMessageVisible()).toBeTruthy()
  })

  it('Displays the home page on successful login and stores credentials', async () => {
    expect(await LoginPage.isVisible()).toBeTruthy()

    await mockValidTokenRequest()

    await LoginPage.fillFormAndSubmit({ email, password })
    await HomePage.waitForPageDisplayed()
    expect(await HomePage.isVisible()).toBeTruthy()

    await browser.reloadSession()

    expect(await HomePage.isVisible()).toBeTruthy()
  }, 30000)
})