import * as LoginPage from './page-objects/login.po'
import { mockValidTokenRequest } from './wiremockHelpers'
import * as HomePage from './page-objects/home.po'

export const loginIfNeeded = async () => {
  const email = process.env.E2E_EMAIL || 'test@example.com'
  const password = process.env.E2E_PASSWORD || 'SuperPassword'

  if (await LoginPage.isVisible()) {
    await mockValidTokenRequest()

    await LoginPage.fillFormAndSubmit({ email, password })
    await HomePage.waitForPageDisplayed()
  }
}