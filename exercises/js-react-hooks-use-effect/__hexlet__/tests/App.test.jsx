// @ts-check

import { expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Products from '../src/Products.jsx'

const products = [
  {
    name: 'Хлеб', id: 1, price: 25, count: 0,
  },
  {
    name: 'Молоко', id: 2, price: 45, count: 0,
  },
]

vi.mock('../src/utils.js', () => ({
  default: async () => products,
}))

test('should display list of products', async () => {
  render(<Products />)

  await screen.findByText('Хлеб. Цена: 25 р.')
  await screen.findByText('Молоко. Цена: 45 р.')

  fireEvent.click(screen.getByTestId('increment-1'))
  fireEvent.click(screen.getByTestId('increment-1'))
  fireEvent.click(screen.getByTestId('increment-2'))
  fireEvent.click(screen.getByTestId('increment-2'))
  fireEvent.click(screen.getByTestId('decrement-1'))

  const totalPrice = products[0].price + products[1].price * 2
  expect(screen.getByText(`Итого цена: ${totalPrice}`)).toBeTruthy()
})
