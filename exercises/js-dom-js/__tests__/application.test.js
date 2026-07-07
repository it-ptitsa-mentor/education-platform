// @vitest-environment jsdom
import { fileURLToPath as __toPath } from 'node:url';
import __nodePath from 'node:path';
const __dirname = __nodePath.dirname(__toPath(import.meta.url));
// @ts-check

import { test, expect } from 'vitest'

import fs from 'fs'
import path from 'path'

test('application', async () => {
  const htmlPath = path.resolve(__dirname, '..', 'index.html')
  const initHtml = fs.readFileSync(htmlPath).toString()
  document.documentElement.innerHTML = initHtml

  const element = document.querySelector('script')
  expect(element.getAttribute('src')).toMatch(/^((\.\/)?|(\/?))src\/index\.js$/)
  expect(element).toBeInTheDocument()
})
