import { expect, test, expectTypeOf } from 'vitest'

import filterAnagrams from '../solution'

test('function', () => {
  expect(filterAnagrams('abba', ['aabb', 'abcd', 'bbaa', 'dada'])).toEqual(['aabb', 'bbaa'])

  expect(filterAnagrams('racer', ['crazer', 'carer', 'racar', 'caers', 'racer'])).toEqual(['carer', 'racer'])

  expect(filterAnagrams('laser', ['lazing', 'lazy', 'lacer'])).toEqual([])

  expectTypeOf(filterAnagrams).returns.toMatchTypeOf<string[]>()
})
