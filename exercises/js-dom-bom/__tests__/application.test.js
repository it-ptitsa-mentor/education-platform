// @vitest-environment jsdom
// @ts-check

import { afterEach, test, expect, vi } from 'vitest'
import solution from '../src/solution.js'

const assignMock = vi.fn()

// Мокаем window.location.assign
delete window.location
window.location = { assign: assignMock }

afterEach(() => {
  assignMock.mockClear()
})

test('application', () => {
  expect(solution('https://hexlet.io')).toMatch(/Mozilla\/\d\.\d https:\/\/hexlet\.io/)
})
