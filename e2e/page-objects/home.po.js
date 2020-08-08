import { getTextFromElement, isElementVisible, select, tapOnButton, waitForElementExist } from './helpers.po'

const homeContainerSelector = '[data-home-container]'

export const waitForPageDisplayed = async () => await waitForElementExist(homeContainerSelector)
export const isVisible = async () => await isElementVisible(homeContainerSelector)

export const getBatteryLevel = async () => {
  const selector = 'p[data-battery-level]'
  await global.client.waitUntil(
    () => select(selector).then(elem => elem.getText()).then(text => text !== '0'),
    {
      timeout: 5000,
      timeoutMsg: 'expected battery level to be different than 0 after 5s',
    },
  )
  return await getTextFromElement(selector)
}

export const getMowerActivity = async () => {
  const selector = 'span[data-mower-activity]'
  await global.client.waitUntil(
    () => select(selector).then(elem => elem.getText()).then(text => text !== ''),
    {
      timeout: 5000,
      timeoutMsg: 'expected mower activity to not be empty after 5s',
    },
  )

  return await getTextFromElement(selector)
}

export const getMowerState = async () => {
  const selector = 'span[data-mower-state]'
  await global.client.waitUntil(
    () => select(selector).then(elem => elem.getText()).then(text => text !== ''),
    {
      timeout: 5000,
      timeoutMsg: 'expected mower state to not be empty after 5s',
    },
  )

  return await getTextFromElement(selector)
}

export const logout = async () => await tapOnButton('div[data-logout-button]')