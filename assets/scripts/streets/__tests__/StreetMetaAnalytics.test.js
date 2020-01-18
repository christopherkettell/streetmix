/* eslint-env jest */
import React from 'react'
import { fireEvent } from '@testing-library/react'
import StreetMetaAnalytics from '../StreetMetaAnalytics'
import { renderWithReduxAndIntl } from '../../../../test/helpers/render'
import { showDialog } from '../../store/actions/dialogs'

jest.mock('../../store/actions/dialogs', () => ({
  showDialog: jest.fn(() => ({ type: 'MOCK_ACTION' }))
}))

describe('StreetMetaAnalytics', () => {
  afterEach(() => {
    // Resets mock call counter between tests
    showDialog.mockClear()
  })

  it('renders analytics and opens a dialog when clicked', () => {
    const { getByText } = renderWithReduxAndIntl(<StreetMetaAnalytics />, {
      initialState: {
        street: {
          segments: [
            {
              type: 'sidewalk',
              width: 6
            },
            {
              type: 'bus-lane',
              width: 12
            }
          ]
        },
        locale: {
          locale: 'en'
        }
      }
    })

    fireEvent.click(getByText('24,000 people/hr'))
    expect(showDialog).toBeCalledTimes(1)
  })
})
