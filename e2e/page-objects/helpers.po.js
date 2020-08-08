export const waitForElementExist = async (selector) => select(selector)
  .then(elem => elem.waitForExist({ timeout: 2000 }))

export const isElementVisible = async selector => {
  const elem = await select(selector)
  return elem.isDisplayed()
}

export const fillInput = async (selector, value) => {
  const fullSelector = `${selector} input`

  const elem = await select(fullSelector)

  await elem.waitForDisplayed()

  const currentValue = await elem.getValue()
  await elem.setValue('\uE003'.repeat(currentValue.length) + value)
}

export const tapOnButton = selector => select(selector).then(elem => elem.click())

export const getTextFromElement = selector => select(selector).then(elem => elem.getText(selector))

export const select = selector => global.client.$(selector)