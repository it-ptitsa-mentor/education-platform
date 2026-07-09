// @vitest-environment jsdom
// @vitest-environment jsdom
import { it, describe, expect, afterEach, beforeAll, afterAll } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

import App from '../src/components/App.jsx'
import store from '../src/slices/index.js'
import { uniqueId } from 'es-toolkit/compat';

// Fake initial data
const newTaskText = 'na-na'
const item1 = { name: 'test1', id: uniqueId() }
const item2 = { name: 'test2', id: uniqueId() }
const newItem = { name: newTaskText, id: uniqueId() }

const handlers = [
  http.get('/api/tasks', () => HttpResponse.json({ items: [item1, item2] })),
  http.post('/api/tasks', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ name: body.name, id: newItem.id }, { status: 201 })
  }),
  http.delete(`/api/tasks/${item1.id}`, () => new HttpResponse(null, { status: 204 })),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

describe('App', () => {
  it('loads tasks, adds a task, and removes one', async () => {
    render(<Provider store={store}><App /></Provider>)

    // Check initial tasks
    expect(await screen.findByText(item1.name)).toBeInTheDocument()
    expect(await screen.findByText(item2.name)).toBeInTheDocument()

    // Add new task
    const input = screen.getByTestId('input')
    const submit = screen.getByTestId('submit')
    await userEvent.type(input, newTaskText)
    await userEvent.click(submit)

    expect(await screen.findByText(newTaskText)).toBeInTheDocument()

    // Remove first task using aria-label
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await userEvent.click(removeButtons[0])

    await waitFor(() => {
      expect(screen.queryByText(item1.name)).not.toBeInTheDocument()
    })
  })
})
