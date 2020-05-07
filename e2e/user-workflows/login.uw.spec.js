import * as LoginPage from '../page-objects/login.po'
import * as HomePage from '../page-objects/home.po'

describe('Login', () => {
  const email = process.env.E2E_EMAIL
  const password = process.env.E2E_PASSWORD

  it('Displays the home page on successful login and stores credentials', async () => {
    expect(await LoginPage.isVisible()).toBeTruthy()

    await LoginPage.fillFormAndSubmit({ email, password })
    await HomePage.waitForPageDisplayed()
    expect(await HomePage.isVisible()).toBeTruthy()

    await global.restart()
    expect(await HomePage.isVisible()).toBeTruthy()

    await HomePage.logout()
    await LoginPage.waitForPageDisplayed()
    expect(await LoginPage.isVisible()).toBeTruthy()

    await global.restart()
    expect(await LoginPage.isVisible()).toBeTruthy()
  }, 30000)
})