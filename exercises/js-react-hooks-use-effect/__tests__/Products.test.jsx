// @vitest-environment jsdom
// @ts-check

// У этого задания нет оригинального теста Hexlet в контейнере —
// тест написан по условию: продукты загружаются в useEffect через getProducts.
import { beforeEach, expect, test, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Products from '../src/Products.jsx'
import products from '../src/products.json'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    json: async () => products,
  })))
})

test('загружает продукты один раз через useEffect', async () => {
  render(<Products />)

  await waitFor(() => {
    expect(screen.getByText(/Хлеб\. Цена: 25 р\./)).toBeInTheDocument()
  })
  expect(screen.getByText(/Молоко\. Цена: 45 р\./)).toBeInTheDocument()
  expect(screen.getByText(/Чай\. Цена: 150 р\./)).toBeInTheDocument()
  expect(fetch).toHaveBeenCalledTimes(1)
})

test('инкремент и декремент меняют итоговую цену', async () => {
  render(<Products />)
  await waitFor(() => {
    expect(screen.getByTestId('products').children).toHaveLength(3)
  })

  await userEvent.click(screen.getByTestId('increment-1'))
  await userEvent.click(screen.getByTestId('increment-2'))
  expect(screen.getByText('Итого цена: 70')).toBeInTheDocument()

  await userEvent.click(screen.getByTestId('decrement-2'))
  expect(screen.getByText('Итого цена: 25')).toBeInTheDocument()
})
