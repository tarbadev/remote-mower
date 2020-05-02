export const waitForElementExist = async (selector) => await global.client.waitForExist(selector, { timeout: 2000 })

export const isElementVisible = async (selector) => await global.client.isVisible(selector)

export const fillInput = async (selector, value) => await global.client.$(`${selector} input`).setValue(value)

export const tapOnButton = async (selector) => await global.client.click(selector)