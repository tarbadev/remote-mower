import { isElementVisible, waitForElementExist } from './helpers.po'

export const waitForPageDisplayed = async () => await waitForElementExist('[data-home-container]')
export const isVisible = async () => await isElementVisible('[data-home-container]')