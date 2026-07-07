// @ts-check

import { test, expect } from 'vitest'
import { render } from '@testing-library/react'

import Alert from '../src/Alert.jsx'

test('Alert 1', () => {
  const params = {
    type: 'danger',
    text: 'text 1',
  }
  const { asFragment } = render(<Alert {...params} />)
  expect(asFragment()).toMatchSnapshot()
})

test('Alert 2', () => {
  const params = {
    type: 'dark',
    text: 'text 2',
  }
  const { asFragment } = render(<Alert {...params} />)
  expect(asFragment()).toMatchSnapshot()
})
