// @ts-check
import { expect, test, expectTypeOf } from 'vitest'
import max from '../solution'

test('function', () => {
  expect(max(1, 3, 8)).toBe(8)
  expect(max(10)).toBe(10)
  expect(max(4, 1)).toBe(4)

  expectTypeOf(max).parameters.toMatchTypeOf<[number, ...number[]]>()
  expectTypeOf(max).returns.toMatchTypeOf<number>()
})
