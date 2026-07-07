// @vitest-environment jsdom
// @ts-check

import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import Card from '../src/Card.jsx'

test('Card', () => {
  const dom = <Card />
  const { asFragment } = render(dom)

  expect(asFragment()).toMatchSnapshot()
})

test('Card 2', () => {
  const dom = (
    <Card>
      <Card.Title>Title</Card.Title>
    </Card>
  )
  const { asFragment } = render(dom)

  expect(asFragment()).toMatchSnapshot()
})

test('Card 3', () => {
  const dom = (
    <Card>
      <Card.Body>
        <Card.Title>Title</Card.Title>
        <Card.Text>Text</Card.Text>
      </Card.Body>
    </Card>
  )
  const { asFragment } = render(dom)

  expect(asFragment()).toMatchSnapshot()
})

test('Card 4', () => {
  const dom = (
    <Card>
      <Card.Body>
        <Card.Title>Title 3</Card.Title>
        <Card.Text>Text 3</Card.Text>
      </Card.Body>
    </Card>
  )
  const { asFragment } = render(dom)

  expect(asFragment()).toMatchSnapshot()
})
