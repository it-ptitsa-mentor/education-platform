// @ts-check

import { expect, test } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Collapse from '../src/Collapse.jsx'

test('Collapse', () => {
  const vdom = <Collapse text="hi" opened={false} />
  const wrapper = render(vdom)
  expect(wrapper.asFragment()).toMatchSnapshot()

  const button = wrapper.getByText('Link with href')

  fireEvent.click(button)
  expect(wrapper.asFragment()).toMatchSnapshot()

  fireEvent.click(button)
  expect(wrapper.asFragment()).toMatchSnapshot()

  fireEvent.click(button)
  expect(wrapper.asFragment()).toMatchSnapshot()
})

test('Collapse2', () => {
  const vdom = <Collapse text="i am grut" />
  const wrapper = render(vdom)
  expect(wrapper.asFragment()).toMatchSnapshot()
})
