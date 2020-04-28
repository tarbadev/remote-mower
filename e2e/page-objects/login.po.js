import { fillInput, goToUrl, tapOnButton, isElementVisible } from './helpers.po'

export const goTo = async () => await goToUrl('/')

export const isVisible = async () => await isElementVisible('[data-login-container]')

export const fillFormAndSubmit = async ({ email, password }) =>{
  await fillInput('[data-email]', email)
  await fillInput('[data-password]', password)
  await tapOnButton('[data-submit]')
}