// @ts-check

import { test, expect } from 'vitest'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../src/components/App.jsx'
import store from '../src/slices/index.js'

test('Store', async () => {
  const vdom = (
    <Provider store={store}>
      <App />
    </Provider>
  )
  const { asFragment } = render(vdom)
  expect(asFragment()).toMatchSnapshot()

  const newTaskInput = screen.getByTestId('input')
  const newTaskSubmit = screen.getByTestId('submit')

  await userEvent.type(newTaskInput, 'na-na')
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(newTaskSubmit)
  expect(asFragment()).toMatchSnapshot()

  await userEvent.type(newTaskInput, 'another task')
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(newTaskSubmit)
  expect(asFragment()).toMatchSnapshot()
})
