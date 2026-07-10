// @ts-check
import { expect, test, expectTypeOf } from 'vitest'

import lastIndex from '../solution'

test('lastIndex', () => {
  const str = 'jest'
  expect(lastIndex(str, 'j')).toBe(0)
  expect(lastIndex(str, 't')).toBe(3)
  expect(lastIndex(str, 'e')).toBe(1)
  expect(lastIndex(str, 'p')).toBeNull()
  expect(lastIndex('test', 't')).toBe(3)

  expectTypeOf(lastIndex).returns.toMatchTypeOf<number | null>()
})
