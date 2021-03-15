export const waitForElementExist = async (selector) => select(selector)
  .then(elem => elem.waitForExist({ timeout: 5000 }))

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

export const getTextFromElementWithTimeout = async (selector, timeout, errorMessage) => {
  await global.client.waitUntil(
      () => select(selector).then(elem => elem.getText()).then(text => text !== '' && text !== '0'),
      {
        timeout: timeout,
        timeoutMsg: errorMessage,
      },
  )

  return await getTextFromElement(selector)
}

export const select = selector => global.client.$(selector)
export const selectAll = selector => global.client.$$(selector)