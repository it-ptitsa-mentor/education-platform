// @ts-check
import { expect, test } from 'vitest'
import reverse from '../solution'

test('function', () => {
  expect(reverse([])).toEqual([])
  expect(reverse([1, 2])).toEqual([2, 1])
  expect(reverse([8, 3, 9])).toEqual([9, 3, 8])
})
