export const waitForTextByCss = (cssSelector, text) => {
  global.page.waitForFunction(
    (selector, textToSearch) => {
      const element = document.querySelector(selector)
      if (element && element.innerText) {
        return element.innerText.toLowerCase().includes(textToSearch)
      }
    },
    {},
    cssSelector.replace(/"/g, '\\"'),
    text.toLowerCase(),
  )
}

export const waitForTextNotEmptyByCss = (cssSelector) => {
  global.page.waitForFunction(
    `document.querySelector("${cssSelector.replace(/"/g, '\\"')}").innerText`,
  )
}

export const getTextByCssSelector = selector => {
  return global.page.$eval(
    selector,
    element => element.textContent,
  )
}

export const waitForElementExist = async (selector) => await global.client.waitForExist(selector)

export const isElementVisible = async (selector) => await global.client.isVisible(selector)

export const fillInput = async (selector, value) => await global.client.$(`${selector} input`).setValue(value)

export const tapOnButton = async (selector) => await global.client.click(selector)