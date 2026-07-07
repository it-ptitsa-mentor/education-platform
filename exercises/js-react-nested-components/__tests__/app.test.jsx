// @vitest-environment jsdom
// @ts-check

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TodoBox from '../src/TodoBox.jsx'

beforeEach(() => {
  render(<TodoBox />)
})

test('working', async () => {
  expect(screen.getByRole('textbox')).toBeInTheDocument()

  await userEvent.type(screen.getByRole('textbox'), 'my first task')
  expect(screen.getByRole('textbox')).toHaveDisplayValue('my first task')

  await userEvent.click(screen.getByRole('button', { name: /add/i }))
  expect(screen.getByRole('textbox')).toHaveDisplayValue('')
  expect(screen.getByText('my first task')).toBeInTheDocument()

  await userEvent.type(screen.getByRole('textbox'), 'my second task')
  await userEvent.click(screen.getByRole('button', { name: /add/i }))
  await userEvent.type(screen.getByRole('textbox'), 'one more task')
  await userEvent.click(screen.getByRole('button', { name: /add/i }))
  expect(screen.getByText('my second task')).toBeInTheDocument()
  expect(screen.getByText('one more task')).toBeInTheDocument()

  const secondTask = screen.getByText('my second task')
  const btnToRemoveSecondTask = within(secondTask.parentNode).getByRole('button', { name: '-' })
  await userEvent.click(btnToRemoveSecondTask)
  expect(screen.queryByText('my second task')).not.toBeInTheDocument()
  expect(screen.getByText('my first task')).toBeInTheDocument()
  expect(screen.getByText('one more task')).toBeInTheDocument()

  const firstTask = screen.getByText('my first task')
  const btnToRemoveFirstTask = within(firstTask.parentNode).getByRole('button', { name: '-' })
  await userEvent.click(btnToRemoveFirstTask)
  expect(screen.queryByText('my first task')).not.toBeInTheDocument()
  expect(screen.getByText('one more task')).toBeInTheDocument()
})

test('identical tasks', async () => {
  await userEvent.type(screen.getByRole('textbox'), 'my first task')
  await userEvent.click(screen.getByRole('button', { name: /add/i }))
  await userEvent.type(screen.getByRole('textbox'), 'my first task')
  await userEvent.click(screen.getByRole('button', { name: /add/i }))
  expect(screen.getAllByText('my first task')).toHaveLength(2)

  const btnToRemoveSecondTask = screen.getAllByRole('button', { name: '-' })[1]
  await userEvent.click(btnToRemoveSecondTask)
  expect(screen.getAllByText('my first task')).toHaveLength(1)
})
