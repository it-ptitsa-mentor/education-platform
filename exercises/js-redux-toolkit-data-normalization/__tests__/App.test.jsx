// @vitest-environment jsdom
// @ts-check

import { test, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'

import App from '../src/components/App.jsx'
import store from '../src/slices/index.js'

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Work 1', async () => {
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
      author: { id: 'user2', username: 'user2', name: 'User 2' },
      body: 'Второй пост',
      comments: [],
    },
  ]

  server.use(http.get('/api/data', () => HttpResponse.json(blogPosts)))
  const vdom = (
    <Provider store={store}>
      <App />
    </Provider>
  )

  render(vdom)
  expect(await screen.findByText(`${blogPosts[0].body} - ${blogPosts[0].author.name}`)).toBeInTheDocument()
  expect(await screen.findByText(`${blogPosts[1].body} - ${blogPosts[1].author.name}`)).toBeInTheDocument()

  expect(await screen.findByText(blogPosts[0].comments[0].text)).toBeInTheDocument()
  expect(await screen.findByText(blogPosts[0].comments[0].author.name)).toBeInTheDocument()
  expect(await screen.findByText(blogPosts[0].comments[1].text)).toBeInTheDocument()
  expect(await screen.findByText(blogPosts[0].comments[1].author.name)).toBeInTheDocument()
})
