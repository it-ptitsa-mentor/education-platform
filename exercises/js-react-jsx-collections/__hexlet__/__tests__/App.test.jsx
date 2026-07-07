// @ts-check

import { render } from '@testing-library/react'
import { test, expect } from 'vitest'
import DefinitionsList from '../src/DefinitionsList.jsx'

test('Definitions 1', () => {
  const definitions = [
    { dt: 'one', dd: 'two', id: 1 },
    { dt: 'another term', dd: 'another description', id: 2 },
  ]
  const { asFragment } = render(<DefinitionsList data={definitions} />)
  expect(asFragment()).toMatchSnapshot()
})

test('Definitions 2', () => {
  const definitions = [
    { dt: 'one', dd: 'two', id: 1 },
  ]
  const { asFragment } = render(<DefinitionsList data={definitions} />)
  expect(asFragment()).toMatchSnapshot()
})

test('Definitions 3', () => {
  const definitions = [
    { dt: 'another term', dd: 'another description', id: 1 },
    { dt: 'one', dd: 'two', id: 2 },
  ]
  const { asFragment } = render(<DefinitionsList data={definitions} />)
  expect(asFragment()).toMatchSnapshot()
})

test('Definitions 4', () => {
  const definitions = []
  const { asFragment } = render(<DefinitionsList data={definitions} />)
  expect(asFragment()).toMatchSnapshot()
})
