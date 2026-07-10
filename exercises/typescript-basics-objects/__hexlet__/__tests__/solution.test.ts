// @ts-check
import { expect, test, expectTypeOf } from 'vitest'

import isComplete from '../solution'

test('function', () => {
  const course1 = {
    name: 'Java',
    lessons: ['variables', 'functions', 'conditions'],
  }
  expect(isComplete(course1)).toBe(false)

  const course2 = {
    name: 'Java',
    lessons: ['variables', 'functions', 'conditions', 'loops'],
  }
  expect(isComplete(course2)).toBe(true)

  expectTypeOf(isComplete).returns.toMatchTypeOf<boolean>()
  expectTypeOf(isComplete).parameters.toMatchTypeOf<{ name: string, lessons: string[] }>()
})
