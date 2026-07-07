// @ts-check

import '@testing-library/jest-dom/vitest'
import { vi, test, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

test('scripts count', () => {
  const initHtml = fs.readFileSync(path.join('index.html')).toString()
  document.documentElement.innerHTML = initHtml

  const scripts = document.querySelectorAll('script')

  expect(scripts).toHaveLength(2)
})

test('global variable', async () => {
  const spy = vi.spyOn(window.console, 'log')

  await import('../src/writer.js')
  await import('../src/reader.js')

  expect(spy).toHaveBeenCalledWith('Dont do it in real life')
  expect(window.myvar).toBe('Dont do it in real life')
})
