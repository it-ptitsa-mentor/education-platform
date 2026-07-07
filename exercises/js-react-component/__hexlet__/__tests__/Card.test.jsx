// @ts-check

import { test, expect } from 'vitest'
import { render } from '@testing-library/react'

import Card from '../src/Card.jsx'

test('Alert 1', () => {
  const { asFragment } = render(<Card />)
  expect(asFragment()).toMatchSnapshot()
})
