// @ts-check

import '@testing-library/jest-dom'

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'

import nock from 'nock'
import App from '../src/components/App.jsx'
import store from '../src/slices/index.js'

test('Work 1', async () => {
  const users = [
    { id: 'user1', username: 'user1', name: 'User 1' },
    { id: 'user2', username: 'user2', name: 'User 2' },
    { id: 'user3', username: 'user3', name: 'User 3' },
  ]
  const posts = [
    {
      id: 'post1',
      author: 'user1',
      body: 'Первый пост',
      comments: ['comment1', 'comment2'],
    },
    {
      id: 'post2',
      author: 'user2',
      body: 'Второй пост',
      comments: [],
    },
  ]
  const comments = [
    {
      id: 'comment1',
      author: 'user2',
      text: 'Первый комментарий',
    },
    {
      id: 'comment2',
      author: 'user3',
      text: 'Второй комментарий',
    },
  ]
  const blogPosts = {
    users,
    posts,
    comments,
  }
  nock('http://localhost').get('/api/data').reply(200, blogPosts)

  const vdom = (
    <Provider store={store}>
      <App />
    </Provider>
  )

  render(vdom)
  expect(await screen.findByText('Первый пост - User 1')).toBeInTheDocument()
  expect(await screen.findByText('Второй пост - User 2')).toBeInTheDocument()

  expect(await screen.findByText('Первый комментарий')).toBeInTheDocument()
  expect(await screen.findByText('User 2')).toBeInTheDocument()
  expect(await screen.findByText('Второй комментарий')).toBeInTheDocument()
  expect(await screen.findByText('User 3')).toBeInTheDocument()
})
