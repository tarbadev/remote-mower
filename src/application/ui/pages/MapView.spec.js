import React from 'react'
import { mount } from 'enzyme'
import { waitForUpdate } from '../../../testUtils'
import { MapView } from './MapView'
import { getMowerPositions } from '../../../domain/MowerPositionsService'

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

jest.mock('./MowerPositionsService')

describe('MapView', () => {
  beforeEach(() => {
    mockTranslate.mockReset()
    mockTranslate.mockReturnValue('Some translation happened')

    getMowerPositions.mockResolvedValue([])
  })

  it('Loads schedule on load', async () => {
    getMowerPositions.mockResolvedValue([])

    const schedule = mount(<MapView />)
    await waitForUpdate(schedule)

    expect(getMowerPositions).toHaveBeenCalled()
  })
})