// @vitest-environment jsdom
// @ts-check

// Оригинальный тест Hexlet для этого задания — Playwright (см. __hexlet__),
// в vitest-раннере он не исполним. Этот тест повторяет его сценарий на RTL.
import { describe, test, expect } from 'vitest'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import i18next from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'

import App from '../src/App.jsx'
import resources from '../src/locales/index.js'

const renderApp = () => {
  const i18n = i18next.createInstance()
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    initImmediate: false,
  })
  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  )
}

describe('useCallback factorial', () => {
  test('factorial buttons', async () => {
    renderApp()

    await userEvent.click(screen.getByRole('button', { name: /^Factorial 1$/ }))
    expect(screen.getByText('Factorial of 1 is 1')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /^Factorial 5$/ }))
    expect(screen.getByText('Factorial of 5 is 120')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /^Factorial 10$/ }))
    expect(screen.getByText('Factorial of 10 is 3628800')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /^Factorial 20$/ }))
    expect(screen.getByText('Factorial of 20 is 2432902008176640000')).toBeInTheDocument()
  })

  test('language switch keeps result', async () => {
    renderApp()

    await userEvent.click(screen.getByRole('button', { name: 'Русский' }))
    await userEvent.click(screen.getByRole('button', { name: /^Факториал 10$/ }))
    expect(screen.getByText('Factorial of 10 is 3628800')).toBeInTheDocument()
  })
})
