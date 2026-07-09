// @vitest-environment jsdom
// @ts-check

import { test, expect } from 'vitest'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import userEvent from '@testing-library/user-event'

import reducers from '../src/reducers/index.js'
import middlewares from '../src/middlewares'
import App from '../src/components/App.jsx'

test('Store', async () => {
  const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware => getDefaultMiddleware()
      .concat(middlewares.addDate),
  })

  const vdom = (
    <Provider store={store}>
      <App />
    </Provider>
  )

  render(vdom)

  expect(screen.getByRole('textbox')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()

  await userEvent.type(screen.getByRole('textbox'), 'first task')
  expect(screen.getByRole('textbox')).toHaveDisplayValue('first task')

  const today = new Date()
  const formatedDate = today.toLocaleDateString('ru-RU')
  await userEvent.click(screen.getByRole('button', { name: /Add/i }))
  expect(screen.getByRole('textbox')).toHaveDisplayValue('')
  expect(screen.getByRole('link', { name: `Задача на ${formatedDate}: first task` })).toBeInTheDocument()
})
