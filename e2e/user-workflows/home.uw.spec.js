import * as HomePage from '../page-objects/home.po'
import * as LoginPage from '../page-objects/login.po'

describe('Home', () => {
  const email = process.env.E2E_EMAIL
  const password = process.env.E2E_PASSWORD

  beforeEach(async () => {
    if (await LoginPage.isVisible()) {
      await LoginPage.fillFormAndSubmit({ email, password })
      await HomePage.waitForPageDisplayed()
    }
  })

  it('Displays the battery level', async () => {
    expect(await HomePage.isVisible()).toBeTruthy()

    expect(await HomePage.getBatteryLevel()).not.toBeNaN()
    expect(await HomePage.getBatteryLevel()).not.toBe('0')
  })
})