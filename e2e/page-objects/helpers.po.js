export const waitForElementExist = async (selector) => await global.client.waitForExist(selector, { timeout: 2000 })

export const isElementVisible = async (selector) => await global.client.isVisible(selector)

export const fillInput = async (selector, value) => {
  const fullSelector = `${selector} input`

  await global.client
    .waitForVisible(fullSelector)
    .click(fullSelector)
    .keys('Shift')
    .keys('Home')
    .keys('Backspace')
    .keys('Shift')
    .setValue(fullSelector, value)
}

export const tapOnButton = async (selector) => await global.client.click(selector)

export const getTextFromElement = async (selector) => global.client.getText(selector)