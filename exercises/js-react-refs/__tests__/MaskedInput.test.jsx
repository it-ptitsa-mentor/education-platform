// @vitest-environment jsdom
// @ts-check

import { it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import MaskedInput from '../src/MaskedInput.jsx'

beforeAll(() => {
  document.body.innerHTML = '<div id="container"></div>'
})

it('MaskedInput', async () => {
  let value
  const onAccept = (v) => {
    value = v
  }

  const container = document.getElementById('container')

  render(<MaskedInput onAccept={onAccept} />, { container })
  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()

  await userEvent.type(input, '9')
  expect(value).toBe('+7(9')

  await userEvent.type(input, '991234567')
  expect(value).toBe('+7(999)123-45-67')
})
