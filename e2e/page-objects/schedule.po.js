import { isElementVisible, pause, selectAll, tapOnButton, waitForElementExist } from './helpers.po'

const scheduleContainerSelector = '[data-schedule-container]'

export const waitForPageDisplayed = async () => await waitForElementExist(scheduleContainerSelector)

export const isVisible = async () => await isElementVisible(scheduleContainerSelector)
export const isEditModeVisible = async () => await isElementVisible('[data-edit-schedule-container]')

export const goTo = async () => await tapOnButton('[data-schedule-button]')

export const tapOnEditButton = () => tapOnButton('[data-edit-schedule-button]')
export const tapOnDeleteButton = () => tapOnButton('[data-delete-schedule-button]')
export const tapOnSaveButton = async () => {
  await tapOnButton('[data-schedule-save-button]')
  await pause(500)
}

export const getSchedulesCount = async () => {
  return (await selectAll('[data-schedule-card]')).length
}