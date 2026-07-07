// @vitest-environment jsdom
// @ts-check

import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import Component from '../src/Component.jsx'

test('Component 1', async () => {
  render(<Component />)

  const modal = screen.getByRole('dialog', { hidden: true })
  expect(modal).not.toBeVisible()

  const openingButton = screen.getByRole('button', { name: /open/i })
  await userEvent.click(openingButton)
  expect(modal).toBeVisible()

  const closingButton1 = screen.getByRole('button', { name: /close/i })
  const closingButton2 = screen.getByRole('button', { name: /cancel/i })

  await userEvent.click(closingButton1)
  expect(modal).not.toBeVisible()
  expect(modal).not.toHaveClass('fade', 'show')

  await userEvent.click(openingButton)
  expect(modal).toBeVisible()
  expect(modal).toHaveClass('fade', 'show')

  await userEvent.click(closingButton2)
  expect(modal).not.toBeVisible()
  expect(modal).not.toHaveClass('fade', 'show')

  await userEvent.click(openingButton)
  expect(modal).toBeVisible()
  expect(modal).toHaveClass('fade', 'show')
})
