// @ts-check

import { test, expect} from 'vitest'

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'

import App from '../src/App.jsx'

test('App 1', async () => {
  render(<App />)

  expect(screen.getByText(/Текст для вкладки Home/i)).toHaveClass('light')
  expect(screen.getByText(/Текст для вкладки Profile/i)).toHaveClass('light')

  await userEvent.click(screen.getByText(/Black/i))

  expect(screen.getByText(/Текст для вкладки Home/i)).toHaveClass('dark')
  expect(screen.getByText(/Текст для вкладки Profile/i)).toHaveClass('dark')
})
