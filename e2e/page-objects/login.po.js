import { fillInput, tapOnButton, isElementVisible, waitForElementExist } from './helpers.po'

const loginContainerSelector = '[data-login-container]'

export const waitForPageDisplayed = async () => await waitForElementExist(loginContainerSelector)
export const isVisible = async () => await isElementVisible(loginContainerSelector)

export const fillFormAndSubmit = async ({ email, password }) =>{
  await fillInput('[data-email]', email)
  await fillInput('[data-password]', password)
  await tapOnButton('[data-submit]')
}