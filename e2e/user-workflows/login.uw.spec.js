import * as LoginPage from '../page-objects/login.po'
import * as HomePage from '../page-objects/home.po'

describe('Login', () => {
  const email = 'some.email@remotemower.com'
  const password = 'SomeSuperSecurePassword'
  let mockLoginCall

  beforeAll(async () => {
    mockLoginCall = await browser.mock('http://localhost:8080/api/v3/token')

    await $('div#root').waitForExist()

    if (await HomePage.isVisible()) {
      await HomePage.logout()
      await LoginPage.waitForPageDisplayed()
    }
  })

  it('Displays an error message on login failure', async () => {
    expect(await LoginPage.isVisible()).toBeTruthy()

    mockLoginCall.respondOnce({}, { statusCode: 400 })

    await LoginPage.fillFormAndSubmit({ email: 'test', password: 'somethingwrong' })

    await LoginPage.waitForErrorMessageDisplayed()
    expect(await LoginPage.isErrorMessageVisible()).toBeTruthy()
  })

  it('Displays the home page on successful login and stores credentials', async () => {
    expect(await LoginPage.isVisible()).toBeTruthy()

    const body = {
      'data': {
        'id': 'c8498880-44a1-27c2-8b8c-100268e0bdab',
        'type': 'token',
        'attributes': {
          'expires_in': 863999,
          'refresh_token': '85c721b7-9298-4a87-9dea-f24364d01a07',
          'provider': 'husqvarna',
          'user_id': '5ca56609-44a0-4fd0-ae72-3370a16f7fb3',
          'scope': 'iam:read iam:write',
          'client_id': 'iam-password-client',
        },
      },
    }
    mockLoginCall.respondOnce(body, { statusCode: 200 })

    await LoginPage.fillFormAndSubmit({ email, password })
    // await browser.debug()
    await HomePage.waitForPageDisplayed()
    expect(await HomePage.isVisible()).toBeTruthy()

    await browser.restart()
    // await global.restart()
    expect(await HomePage.isVisible()).toBeTruthy()
  }, 30000)
})