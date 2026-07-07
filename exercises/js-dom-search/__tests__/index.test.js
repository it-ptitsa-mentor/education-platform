// @vitest-environment jsdom
import { fileURLToPath as __toPath } from 'node:url';
import __nodePath from 'node:path';
const __dirname = __nodePath.dirname(__toPath(import.meta.url));
// @ts-check

import { test, expect, vi } from 'vitest'
import fs from 'fs'
import path from 'path'

test('index', async () => {
  const htmlPath = path.resolve(__dirname, '../index.html')
  const initHtml = fs.readFileSync(htmlPath, 'utf-8')
  document.documentElement.innerHTML = initHtml

  const spy = vi.spyOn(window.console, 'log')

  await import('../src/index.js')

  const expected = {
    description: 'Category Description',
    title: 'Category Name',
    items: [
      { description: 'Article Description 1', title: 'Article Name 1' },
      { description: 'Article Description 2', title: 'Article Name 2' },
    ],
  }

  expect(spy).toHaveBeenCalledWith(expected)
})
