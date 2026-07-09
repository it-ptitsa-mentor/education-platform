// @vitest-environment jsdom
// @ts-check

import { describe, beforeAll, beforeEach, afterEach, afterAll, test, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { Provider } from 'react-redux'
import {
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../src/components/App.jsx'
import store from '../src/slices/index.js'

const blogPosts = [
  {
    id: 'post1',
    author: { id: 'user1', username: 'user1', name: 'User 1' },
    body: 'Первый пост',
    comments: [
      {
        id: 'comment1',
        author: { id: 'user2', username: 'user2', name: 'User 2' },
        text: 'Первый комментарий',
      },
      {
        id: 'comment2',
        author: { id: 'user3', username: 'user3', name: 'User 3' },
        text: 'Второй комментарий',
      },
    ],
  },
  {
    id: 'post2',
    author: {
      id: 'user2',
      username: 'user2',
      name: 'User 2',
    },
    body: 'Второй пост',
    comments: [
      {
        id: 'comment3',
        author: {
          id: 'user1',
          username: 'user1',
          name: 'User 1',
        },
        text: 'Третий комментарий',
      }, {
        id: 'comment4',
        author: {
          id: 'user2',
          username: 'user2',
          name: 'User 2',
        },
        text: 'Четвертый комментарий',
      },
    ],
  },
]

const server = setupServer(
  http.get('/api/data', () => HttpResponse.json(blogPosts)),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Work 1', () => {
  beforeEach(() => {
    const vdom = (
      <Provider store={store}>
        <App />
      </Provider>
    )

    render(vdom)
  })

  test('Remove user', async () => {
    expect(await screen.findByText(`${blogPosts[0].body} - ${blogPosts[0].author.name}`)).toBeInTheDocument()

    await userEvent.click(screen.getAllByRole('button', { name: /удалить/i })[0])
    await waitFor(async () => {
      expect(await screen.queryByText(`${blogPosts[0].body} - ${blogPosts[0].author.name}`)).not.toBeInTheDocument()
      expect(await screen.queryByText(blogPosts[1].comments[0].text)).not.toBeInTheDocument()
    })
  })

  test('Remove post', async () => {
    const postEl = await screen.findByText(`${blogPosts[0].body} - ${blogPosts[0].author.name}`)

    await userEvent.click(within(postEl).getAllByRole('button', { name: /close/i })[0])
    await waitFor(async () => {
      expect(await screen.queryByText(`${blogPosts[0].body} - ${blogPosts[0].author.name}`)).not.toBeInTheDocument()
      expect(await screen.queryByText(blogPosts[0].comments[0].text)).not.toBeInTheDocument()
      expect(await screen.queryByText(blogPosts[0].comments[1].text)).not.toBeInTheDocument()
      expect(await screen.queryByText(blogPosts[1].comments[0].text, { selector: 'p' })).toBeInTheDocument()
    })
  })
})
