// @vitest-environment jsdom
// @ts-check

import { beforeAll, afterAll, afterEach, test, expect } from 'vitest'

import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TodoBox from '../src/TodoBox.jsx'

/**
 * Простая deferred-обёртка для ожидания, что stub сработал.
 */
const makeStub = () => {
  let resolve
  const promise = new Promise((r) => {
    resolve = r
  })
  return {
    done: () => promise,
    trigger: () => resolve(),
  }
}

const server = setupServer()

beforeAll(() => {
  server.listen({
    onUnhandledRequest(req, print) {
      print.error('Found an unhandled %s request to %s', req.method, req.url.href)
    },
  })
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})

// Хелперы для стабов

const stubGetTasks = (tasks = []) => {
  const stub = makeStub()
  server.use(
    http.get('/api/tasks', () => {
      stub.trigger()
      return HttpResponse.json(tasks, { status: 200 })
    }),
  )
  return stub
}

const stubPostTask = (expectedText, responsePayload) => {
  const stub = makeStub()
  server.use(
    http.post('/api/tasks', async ({ request }) => {
      const body = await request.json()
      if (body.text === expectedText) {
        stub.trigger()
        return HttpResponse.json(responsePayload, { status: 200 })
      }
      return HttpResponse.json({ error: 'unexpected body' }, { status: 500 })
    }),
  )
  return stub
}

const stubPatchFinish = (id, responsePayload) => {
  const stub = makeStub()
  server.use(
    http.patch(`/api/tasks/${id}/finish`, () => {
      stub.trigger()
      return HttpResponse.json(responsePayload, { status: 200 })
    }),
  )
  return stub
}

const stubPatchActivate = (id, responsePayload) => {
  const stub = makeStub()
  server.use(
    http.patch(`/api/tasks/${id}/activate`, () => {
      stub.trigger()
      return HttpResponse.json(responsePayload, { status: 200 })
    }),
  )
  return stub
}

test('TodoBox 1: начальный пустой список и добавление двух задач', async () => {
  const getTasksStub = stubGetTasks([])

  render(<TodoBox />)
  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()
  const submitBtn = screen.getByRole('button', { name: 'add' })
  expect(submitBtn).toBeInTheDocument()

  await waitFor(() => getTasksStub.done())

  // Добавляем первую задачу
  const postNewTask = stubPostTask('new task', {
    id: 1,
    state: 'active',
    text: 'new task',
  })
  await userEvent.type(input, 'new task')
  await userEvent.click(submitBtn)
  await waitFor(() => postNewTask.done())
  expect(await screen.findByRole('link', { name: 'new task' })).toBeInTheDocument()

  // Добавляем вторую задачу
  const postNewTask2 = stubPostTask('new task 2', {
    id: 2,
    state: 'active',
    text: 'new task 2',
  })
  await userEvent.clear(input)
  await userEvent.type(input, 'new task 2')
  await userEvent.click(submitBtn)
  await waitFor(() => postNewTask2.done())

  expect(await screen.findByRole('link', { name: 'new task' })).toBeInTheDocument()
  expect(await screen.findByRole('link', { name: 'new task 2' })).toBeInTheDocument()
})

test('TodoBox 2: finish и activate переключения', async () => {
  const tasks = [
    { id: 2, text: 'task 2', state: 'finished' },
    { id: 1, text: 'task 1', state: 'active' },
  ]

  const getTasksStub = stubGetTasks(tasks)

  const { asFragment, container } = render(<TodoBox />)

  await waitFor(() => getTasksStub.done())
  expect(asFragment()).toMatchSnapshot()

  // Перевод активной в finished
  const finishStub = stubPatchFinish(tasks[1].id, { ...tasks[1], state: 'finished' })
  const activeTask = await screen.findByRole('link', { name: 'task 1' })
  await userEvent.click(activeTask)
  await waitFor(() => finishStub.done())
  await waitFor(() => {
    expect(
      container.getElementsByClassName('todo-finished-tasks')[0],
    ).toHaveTextContent('task 1')
  })
  expect(asFragment()).toMatchSnapshot()

  // Перевод finished в active
  const activateStub = stubPatchActivate(tasks[0].id, { ...tasks[0], state: 'active' })
  const finishedTask = await screen.findByRole('link', { name: 'task 2' })
  await userEvent.click(finishedTask)
  await waitFor(() => activateStub.done())
  await waitFor(() => {
    expect(
      container.getElementsByClassName('todo-active-tasks')[0],
    ).toHaveTextContent('task 2')
  })
  expect(asFragment()).toMatchSnapshot()
})
