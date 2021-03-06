/* eslint-env jest */
import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithReduxAndIntl } from '../../../../test/helpers/render'
import SettingsMenu from '../SettingsMenu'
import {
  SETTINGS_UNITS_IMPERIAL,
  SETTINGS_UNITS_METRIC
} from '../../users/constants'
import { updateUnits } from '../../users/localization'
import { clearMenus } from '../../store/slices/menus'

jest.mock('../../users/localization', () => ({
  updateUnits: jest.fn()
}))
jest.mock('../../store/slices/menus', () => ({
  clearMenus: jest.fn((id) => ({ type: 'MOCK_ACTION' }))
}))

const initialState = {
  street: {
    units: SETTINGS_UNITS_METRIC
  },
  locale: {
    locale: 'en',
    requestedLocale: null
  },
  flags: {
    LOCALES_LEVEL_1: { value: true },
    LOCALES_LEVEL_2: { value: true },
    LOCALES_LEVEL_3: { value: true }
  }
}

describe('SettingsMenu', () => {
  afterEach(() => {
    updateUnits.mockClear()
    clearMenus.mockClear()
  })

  it.todo('renders proper locale lists for given feature flags')

  // Currently the wait for expectations do not pass.
  // Possible culprit is that something fails while it's actually
  // retrieving or setting locales.
  xit('handles locale selection', async () => {
    const wrapper = renderWithReduxAndIntl(<SettingsMenu />, { initialState })

    // Clicking this first should not trigger any selection handler
    const selected = wrapper.getByText('English')
    fireEvent.click(selected)
    expect(selected.parentNode.getAttribute('aria-selected')).toBe('true')

    // Change the locale
    const selected2 = wrapper.getByText('Finnish')
    fireEvent.click(selected2)

    await waitFor(() => {
      // Changing a locale is asynchronous, so we wait before testing
      expect(selected.parentNode.getAttribute('aria-selected')).toBe('true')
      expect(selected2.parentNode.getAttribute('aria-selected')).toBe('true')

      expect(clearMenus).toBeCalledTimes(1)
    })
  })

  it('handles metric units selection', () => {
    const wrapper = renderWithReduxAndIntl(<SettingsMenu />, {
      initialState: {
        ...initialState,
        // Set street units to imperial so that change is detected.
        street: {
          units: SETTINGS_UNITS_IMPERIAL
        }
      }
    })

    // Clicking this first should not trigger any selection handler
    fireEvent.click(wrapper.getByText('Imperial units', { exact: false }))
    expect(updateUnits).toBeCalledTimes(0)

    fireEvent.click(wrapper.getByText('Metric units', { exact: false }))
    expect(updateUnits).toBeCalledTimes(1)
    expect(updateUnits).toBeCalledWith(SETTINGS_UNITS_METRIC)

    expect(clearMenus).toBeCalledTimes(1)
  })

  it('handles imperial units selection', () => {
    const wrapper = renderWithReduxAndIntl(<SettingsMenu />, { initialState })

    // Clicking this first should not trigger any selection handler
    fireEvent.click(wrapper.getByText('Metric units', { exact: false }))
    expect(updateUnits).toBeCalledTimes(0)

    fireEvent.click(wrapper.getByText('Imperial units', { exact: false }))
    expect(updateUnits).toBeCalledTimes(1)
    expect(updateUnits).toBeCalledWith(SETTINGS_UNITS_IMPERIAL)

    expect(clearMenus).toBeCalledTimes(1)
  })
})
