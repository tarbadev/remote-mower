import { getTextFromElement, isElementVisible, tapOnButton, waitForElementExist } from './helpers.po'

const homeContainerSelector = '[data-home-container]'

export const waitForPageDisplayed = async () => await waitForElementExist(homeContainerSelector)
export const isVisible = async () => await isElementVisible(homeContainerSelector)

export const getBatteryLevel = async () => {
  const selector = 'p[data-battery-level]'
  await global.client.waitUntil(
    async () => await global.client.$(selector).getText() !== '0',
    {
      timeout: 5000,
      timeoutMsg: 'expected battery level to be different than 0 after 5s'
    }
  )
  return await getTextFromElement(selector)
}

export const getMowerActivity = async () => {
  const selector = 'span[data-mower-activity]'
  await global.client.waitUntil(
    async () => await global.client.$(selector).getText() !== '',
    {
      timeout: 5000,
      timeoutMsg: 'expected mower activity to not be empty after 5s'
    }
  )

  return await getTextFromElement(selector)
}

export const logout = async () => await tapOnButton('div[data-logout-button]')