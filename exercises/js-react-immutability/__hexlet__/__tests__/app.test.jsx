// @ts-check

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import Component from '../src/Component.jsx'

test('Component', async () => {
  const { asFragment } = render(<Component />)

  const inc = screen.getByRole('button', { name: '+' })
  const dec = screen.getByRole('button', { name: '-' })
  expect(inc).toBeInTheDocument()
  expect(dec).toBeInTheDocument()

  await userEvent.click(inc)
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(inc)
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(inc)
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(dec)
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(inc)
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(dec)
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(dec)
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(screen.getAllByRole('button', { name: '2' })[1])
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(screen.getAllByRole('button', { name: '3' })[1])
  await userEvent.click(screen.getAllByRole('button', { name: '2' })[1])
  await userEvent.click(screen.getAllByRole('button', { name: '1' })[0])
  await userEvent.click(screen.getAllByRole('button', { name: '1' })[0])
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(screen.getAllByRole('button', { name: '3' })[0])
  await userEvent.click(screen.getAllByRole('button', { name: '2' })[0])
  expect(asFragment()).toMatchSnapshot()

  await userEvent.click(inc)
  await userEvent.click(dec)
  expect(asFragment()).toMatchSnapshot()

  await userEvent
})
