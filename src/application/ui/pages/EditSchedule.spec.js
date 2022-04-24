import React from 'react'
import { mount } from 'enzyme'
import { getMowerSchedule, setMowerSchedule } from '../../../domain/MowerScheduleService'
import { waitForUpdate } from '../../../testUtils'
import { EditSchedule } from './EditSchedule'
import { TimePicker } from '@material-ui/pickers'

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

class EditScheduleViewHelper {
  constructor(wrapper) {
    this.wrapper = wrapper
    this.editScheduleContainerSelector = '[data-schedule-container]'
    this.deleteButtonSelector = '[data-delete-schedule-button] button'
    this.saveButtonSelector = '[data-schedule-save-button] button'
    this.addButtonSelector = '[data-schedule-add-button] button'
  }

  isVisible() {
    return this.wrapper.find(this.editScheduleContainerSelector).length >= 1
  }

  tapOnDeleteSchedule(index) {
    this.wrapper.find(this.deleteButtonSelector).at(index).simulate('click')
    this.wrapper.find(this.saveButtonSelector).at(0).simulate('click')
  }

  async addSchedule(newSchedule) {
    this.wrapper.find(this.addButtonSelector).simulate('click')
    this.wrapper.find(TimePicker)
      .at(0)
      .props()
      .onChange(new Date(`2020-01-01T${newSchedule.start.hour}:${newSchedule.start.minute}`))
    this.wrapper.find(TimePicker)
      .at(1)
      .props()
      .onChange(new Date(`2020-01-01T${newSchedule.end.hour}:${newSchedule.end.minute}`))
    newSchedule.days.forEach(day => this.wrapper.find(`[data-edit-schedule-day="${day}"]`).at(0).simulate('click'))
    this.wrapper.find(this.saveButtonSelector).at(0).simulate('click')
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

  it('Deletes schedule on delete click', async () => {
    getMowerSchedule.mockResolvedValue([{
      'start': 780,
      'duration': 255,
      'days': {
        'monday': true,
        'tuesday': true,
        'wednesday': true,
        'thursday': false,
        'friday': false,
        'saturday': false,
        'sunday': false,
      },
    }])
    setMowerSchedule.mockResolvedValue()

    const editSchedule = mount(<EditSchedule />)
    const editScheduleViewHelper = new EditScheduleViewHelper(editSchedule)
    await waitForUpdate(editSchedule)

    getMowerSchedule.mockResolvedValue([])
    editScheduleViewHelper.tapOnDeleteSchedule(0)
    await waitForUpdate(editSchedule)

    expect(setMowerSchedule).toHaveBeenCalledWith([])
    expect(getMowerSchedule).toHaveBeenCalledTimes(2)
  })

  it('Adds a schedule', async () => {
    getMowerSchedule.mockResolvedValue([])
    setMowerSchedule.mockResolvedValue()

    const editSchedule = mount(<EditSchedule />)
    const editScheduleViewHelper = new EditScheduleViewHelper(editSchedule)
    await waitForUpdate(editSchedule)

    getMowerSchedule.mockResolvedValue([])
    await editScheduleViewHelper.addSchedule({
      start: { hour: 13, minute: 30 },
      end: { hour: 16, minute: 45 },
      days: ['monday', 'wednesday'],
    })

    expect(setMowerSchedule).toHaveBeenCalledWith([{
      'start': 810,
      'duration': 195,
      'days': {
        'monday': true,
        'tuesday': false,
        'wednesday': true,
        'thursday': false,
        'friday': false,
        'saturday': false,
        'sunday': false,
      },
    }])
    expect(getMowerSchedule).toHaveBeenCalledTimes(2)
  })
})