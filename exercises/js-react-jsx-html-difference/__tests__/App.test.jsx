// @vitest-environment jsdom
// @ts-check

import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import Progress from '../src/Progress.jsx'

test('Progress 1', () => {
  const { container } = render(<Progress percentage={25} />)
  expect(container.firstChild).toMatchSnapshot()
})

test('Progress 2', () => {
  const { container } = render(<Progress percentage={100} />)
  expect(container.firstChild).toMatchSnapshot()
})
