// @vitest-environment jsdom
// @ts-check

import { test, expect, beforeAll, afterEach, afterAll } from 'vitest'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import { Provider } from 'react-redux'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { http, HttpResponse, delay } from 'msw'
import { uniqueId } from 'es-toolkit/compat'

import App from '../src/components/App.jsx'
import store from '../src/services/index.js'

const server = setupServer()

// fetchBaseQuery с относительным baseUrl ('/api/tasks') строит `new Request('/api/tasks')`,
// но undici-Request в Node не умеет резолвить относительные URL без origin.
// Достраиваем абсолютный URL в конструкторе Request — дальше запрос перехватывает msw.
const OriginalRequest = globalThis.Request
class RelativeUrlRequest extends OriginalRequest {
  constructor(input, init) {
    const resolved = typeof input === 'string' && input.startsWith('/')
      ? `http://localhost${input}`
      : input
    super(resolved, init)
  }
}

beforeAll(() => {
  globalThis.Request = RelativeUrlRequest
  server.listen({ onUnhandledRequest: 'error' })
})
afterEach(() => server.resetHandlers())
afterAll(() => {
  server.close()
  globalThis.Request = OriginalRequest
})

test('Work 1', async () => {
  const newTaskText = 'na-na'
  const tasks = [
    { text: 'test1', id: uniqueId() },
    { text: 'test2', id: uniqueId() },
  ]

  server.use(
    http.get('http://localhost/api/tasks', async () => {
      // Компонент вызывает refetch() сразу после мутации, не дожидаясь её.
      // Мутация уходит на сервер первой, поэтому даём ей примениться до ответа GET.
      await delay(100)
      return HttpResponse.json(tasks)
    }),
    http.post('http://localhost/api/tasks', async ({ request }) => {
      const { text } = await request.json()
      const task = { text, id: uniqueId() }
      tasks.push(task)
      return HttpResponse.json(task, { status: 201 })
    }),
    http.delete('http://localhost/api/tasks/:id', ({ params }) => {
      const { id } = params
      const index = tasks.findIndex(task => String(task.id) === String(id))
      if (index !== -1) {
        tasks.splice(index, 1)
      }
      return new HttpResponse(null, { status: 204 })
    }),
  )

  const vdom = (
    <Provider store={store}>
      <App />
    </Provider>
  )

  await render(vdom)
  expect(await screen.findByText(tasks[0].text, {}, { timeout: 5000 })).toBeInTheDocument()

  const newTaskInput = await screen.getByTestId('input')
  const newTaskSubmit = await screen.getByTestId('submit')

  await userEvent.type(newTaskInput, newTaskText)
  await userEvent.click(newTaskSubmit)

  expect(await screen.findByText(newTaskText, {}, { timeout: 5000 })).toBeInTheDocument()
  expect(screen.queryByText('test1')).toBeInTheDocument()

  await userEvent.click(await screen.findByText(newTaskText))
  await waitFor(() => expect(screen.queryByText(newTaskText)).not.toBeInTheDocument(), { timeout: 5000 })
})
