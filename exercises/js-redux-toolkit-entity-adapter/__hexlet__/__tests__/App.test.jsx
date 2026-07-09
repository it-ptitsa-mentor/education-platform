// @ts-check

import { test, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import '@testing-library/jest-dom'

import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

  const { asFragment } = render(vdom)
  expect(await screen.findByText(`${blogPosts[0].body} - ${blogPosts[0].author.name}`)).toBeInTheDocument()
  expect(await screen.findByText(`${blogPosts[1].body} - ${blogPosts[1].author.name}`)).toBeInTheDocument()

  expect(await screen.findAllByText(blogPosts[0].author.name)).toHaveLength(3)
  expect(await screen.findByText(blogPosts[0].comments[0].text)).toBeInTheDocument()
  expect(await screen.findAllByText(blogPosts[0].comments[0].author.name)).toHaveLength(4)
  expect(await screen.findByText(blogPosts[0].comments[1].text)).toBeInTheDocument()
  expect(await screen.findAllByText(blogPosts[0].comments[1].author.name)).toHaveLength(4)

  await userEvent.type(screen.getByLabelText(/текст/i), 'Третий пост')
  await userEvent.selectOptions(screen.getByLabelText('Автор поста'), [blogPosts[0].author.name])
  await userEvent.click(screen.getByRole('button', { name: /создать пост/i }))
  expect(await screen.findByText(`Третий пост - ${blogPosts[0].author.name}`)).toBeInTheDocument()
  expect(await screen.findAllByText(blogPosts[0].author.name)).toHaveLength(4)

  await userEvent.type(screen.getAllByLabelText(/комментарий/i)[0], 'Комментарий к 3 посту')
  await userEvent.selectOptions(screen.getAllByLabelText('Автор комментария')[0], [blogPosts[0].author.name])
  await userEvent.click(screen.getAllByRole('button', { name: 'Создать комментарий' })[0])

  expect(screen.getByText('Комментарий к 3 посту')).toBeInTheDocument()
  expect(await screen.findAllByText(blogPosts[0].author.name)).toHaveLength(5)

  expect(asFragment()).toMatchSnapshot()
})
