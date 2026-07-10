// @ts-check
import { expect, test } from 'vitest'
import lessonsCount from '../solution'

test('function', () => {
  expect(lessonsCount({ lessons: [] })).toBe(0)
  const course = { lessons: ['intro'] }
  expect(lessonsCount(course)).toBe(1)
})
