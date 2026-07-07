// @vitest-environment jsdom
// @ts-check

import { test, expect } from 'vitest'

import { render } from '@testing-library/react'
import ListGroup from '../src/ListGroup.jsx'

test('ListGroup 1', () => {
  const dom = (
    <ListGroup>
      <p>one</p>
      <p>two</p>
    </ListGroup>
  )

  const component = render(dom)
  const tree = component.asFragment()
  expect(tree).toMatchSnapshot()
})

test('ListGroup 2', () => {
  const dom = (
    <ListGroup>
      <a href="google">google</a>
      <a href="yandex">yandex</a>
      <a href="mail">mail</a>
    </ListGroup>
  )

  const component = render(dom)
  const tree = component.asFragment()
  expect(tree).toMatchSnapshot()
})
