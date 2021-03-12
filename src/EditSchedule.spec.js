import React from 'react'
import { mount } from 'enzyme'
import { getMowerSchedule } from './MowerScheduleService'
import { waitForUpdate } from './testUtils'
import { EditSchedule } from './EditSchedule'

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

class EditScheduleViewHelper {
  constructor(wrapper) {
    this.wrapper = wrapper
    this.editScheduleContainerSelector = '[data-schedule-container]'
  }

  isVisible() {
    return this.wrapper.find(this.editScheduleContainerSelector).length >= 1
  }
}

describe('EditSchedule', () => {
  beforeEach(() => {
    mockTranslate.mockReset()
    mockTranslate.mockReturnValue('Some translation happened')

    getMowerSchedule.mockResolvedValue({})
  })

  it('Loads schedule on load', async () => {
    getMowerSchedule.mockResolvedValue([])

    const schedule = mount(<EditSchedule />)
    await waitForUpdate(schedule)

    expect(getMowerSchedule).toHaveBeenCalled()
  })
})