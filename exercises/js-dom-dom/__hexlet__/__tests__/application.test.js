// @ts-check

import { test, expect } from 'vitest'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'

test('scripts count', async () => {
  const htmlPath = path.resolve(__dirname, '..', 'index.html')
  const initHtml = fs.readFileSync(htmlPath).toString()
  document.documentElement.innerHTML = initHtml

  await import('../src/index.js')
  expect(document.body.innerHTML).toMatchSnapshot()
})
