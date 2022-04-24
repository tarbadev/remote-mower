import React from 'react'
import { mount } from 'enzyme'
import { getMowerSchedule } from '../../../domain/MowerScheduleService'
import { Schedule } from './Schedule'
import { waitForUpdate } from '../../../testUtils'

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

jest.mock('../../../domain/MowerScheduleService')

describe('Schedule', () => {
  beforeEach(() => {
    mockTranslate.mockReset()
    mockTranslate.mockReturnValue('Some translation happened')

    getMowerSchedule.mockResolvedValue({})
  })

  it('Loads schedule on load', async () => {
    getMowerSchedule.mockResolvedValue([])

    const schedule = mount(<Schedule />)
    await waitForUpdate(schedule)

    expect(getMowerSchedule).toHaveBeenCalled()
  })
})