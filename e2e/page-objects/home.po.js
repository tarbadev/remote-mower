import {
  fillInput,
  getTextFromElement,
  getTextFromElementWithTimeout,
  isElementVisible,
  select,
  tapOnButton,
  waitForElementExist,
} from './helpers.po'

const homeContainerSelector = '[data-home-container]'

export const waitForPageDisplayed = async () => await waitForElementExist(homeContainerSelector)
export const isVisible = async () => await isElementVisible(homeContainerSelector)

export const getBatteryLevel = async () => {
  return getTextFromElementWithTimeout(
      'p[data-battery-level]',
      5000,
      'expected battery level to be different than 0 after 5s'
  )
}

export const getCuttingLevel = async () => {
  return getTextFromElementWithTimeout(
      'p[data-cutting-level]',
      5000,
      'expected cutting level to be different than 0 after 5s'
  )
}

export const getMowerActivity = async () => {
  return getTextFromElementWithTimeout(
      'span[data-mower-activity]',
      5000,
      'expected mower activity to not be empty after 5s'
  )
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

export const logout = async () => await tapOnButton('[data-logout-button]')
export const refresh = async () => {
  await tapOnButton('[data-refresh-button]')
  await global.client.pause(500)
}
export const parkUntilFurtherNotice = async () => {
  await tapOnButton('[data-park-button]')
  await tapOnButton('[data-park-until-further-notice-menu]')
  await global.client.pause(500)
}
export const parkUntilNextScheduledRun = async () => {
  await tapOnButton('[data-park-button]')
  await tapOnButton('[data-park-until-next-start-menu]')
  await global.client.pause(500)
}
export const parkForDuration = async (hours) => {
  await tapOnButton('[data-park-button]')
  await tapOnButton('[data-park-for-duration-menu]')

  await waitForElementExist('[data-park-duration-dialog]')
  await tapOnButton('[data-park-duration-type]')
  await tapOnButton('[data-duration-dialog-hours]')

  await fillInput('[data-park-duration-input]', hours)

  await tapOnButton('[data-park-duration-submit]')

  await global.client.pause(500)
}
export const pause = async () => {
  await tapOnButton('[data-pause-button]')
  await global.client.pause(500)
}
export const startAndResume = async () => {
  await tapOnButton('[data-start-button]')
  await tapOnButton('[data-start-and-resume-menu]')
  await global.client.pause(500)
}