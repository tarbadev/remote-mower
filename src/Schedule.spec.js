import React from 'react'
import { mount } from 'enzyme'
import { getMowerSchedule } from './MowerScheduleService'
import { Schedule } from './Schedule'
import { waitForUpdate } from './testUtils'

const mockTranslate = jest.fn()
jest.mock(
  'react-i18next',
  () => (
    {
      useTranslation: () => (
        { t: mockTranslate }
      ),
    }
  ),
)

jest.mock('./MowerScheduleService')

class ScheduleViewHelper {
  constructor(scheduleWrapper) {
    this.scheduleWrapper = scheduleWrapper
    this.scheduleContainerSelector = '[data-schedule-container]'
  }

  isVisible() {
    return this.scheduleWrapper.find(this.scheduleContainerSelector).length >= 1
  }
}

describe('Schedule', () => {
  beforeEach(() => {
    mockTranslate.mockReset()
    mockTranslate.mockReturnValue('Some translation happened')

    getMowerSchedule.mockResolvedValue({})
  })

  it('Initializes the MowerService before retrieving data', async () => {
    getMowerSchedule.mockResolvedValue([])

    const schedule = mount(<Schedule />)
    await waitForUpdate(schedule)

    expect(getMowerSchedule).toHaveBeenCalled()
  })
})