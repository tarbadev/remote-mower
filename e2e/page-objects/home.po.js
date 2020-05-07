import { isElementVisible, tapOnButton, waitForElementExist } from './helpers.po'

const homeContainerSelector = '[data-home-container]'

export const waitForPageDisplayed = async () => await waitForElementExist(homeContainerSelector)
export const isVisible = async () => await isElementVisible(homeContainerSelector)

export const logout = async () => await tapOnButton('[data-logout-button]')