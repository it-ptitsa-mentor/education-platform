// @ts-check

import { test, expect } from 'vitest'
import renderer from 'react-test-renderer'
import Card from '../src/Card.jsx'

test('With props 1', () => {
  const title = 'title 1'
  const text = 'text 1'
  const component = renderer.create(<Card title={title} text={text} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('With props 2', () => {
  const title = 'title 2'
  const text = 'text 2'
  const component = renderer.create(<Card title={title} text={text} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Without props 1', () => {
  const text = 'text 2'
  const component = renderer.create(<Card text={text} />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})

test('Without props 2', () => {
  const component = renderer.create(<Card />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
