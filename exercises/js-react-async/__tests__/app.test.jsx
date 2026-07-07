// @vitest-environment jsdom
// @ts-check

import { beforeAll, afterAll, afterEach, test, expect } from 'vitest'

import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Autocomplete from '../src/Autocomplete.jsx'

const server = setupServer(...[
  http.get('/countries', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('term')

    switch (query) {
      case 'a':
        return HttpResponse.json(['afghanistan', 'albania', 'algeria'], { status: 200 })
      case 'al':
        return HttpResponse.json(['albania', 'algeria'], { status: 200 })
      case 'alb':
        return HttpResponse.json(['albania'], { status: 200 })
      case '':
        return HttpResponse.json(['afghanistan', 'albania', 'algeria'], { status: 200 })
      default:
        return HttpResponse.json({
          error: `No mock data for query "${query}" — returning empty array.`,
        }, { status: 500 })
    }
  }),
])

beforeAll(() => {
  server.listen({
    onUnhandledRequest(req, print) {
      print.error(
        'Found an unhandled %s request to %s',
        req.method,
        req.url.href,
      )
    },
  })
})

afterEach(() => server.resetHandlers())

afterAll(() => {
  server.close()
})

test('Autocomplete', async () => {
  render(<Autocomplete />)

  const input = screen.getByRole('textbox')

  await userEvent.type(input, 'a')

  const result1 = await screen.findByRole('list')
  expect(result1).toContainElement(screen.getByText('afghanistan'))
  expect(result1).toContainElement(screen.getByText('albania'))
  expect(result1).toContainElement(screen.getByText('algeria'))

  await userEvent.type(input, 'l')

  const result2 = await screen.findByRole('list')

  await waitFor(() => {
    expect(result2).not.toContainElement(screen.queryByText('afghanistan'))
  })
  expect(result2).toContainElement(screen.getByText('albania'))
  expect(result2).toContainElement(screen.getByText('algeria'))

  await userEvent.type(input, 'b')

  const result3 = await screen.findByRole('list')

  await waitFor(() => {
    expect(result3).not.toContainElement(screen.queryByText('afghanistan'))
  })
  await waitFor(() => {
    expect(result3).not.toContainElement(screen.queryByText('algeria'))
  })
  expect(result3).toContainElement(screen.getByText('albania'))

  await userEvent.clear(input)

  expect(input).toHaveValue('')
  const result4 = screen.queryByRole('list')
  expect(result4).not.toBeInTheDocument()
})
