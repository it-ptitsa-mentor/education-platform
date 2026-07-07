// @ts-check

import { describe, it, expect, vi } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('index', () => {
  it('logs paragraphs', async () => {
    const initHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8')
    document.documentElement.innerHTML = initHtml

    const spy = vi.spyOn(console, 'log')

    await import('../src/index.js')

    const expected = ['First paragraph', 'Second paragraph', 'Third paragraph']
    expect(spy).toHaveBeenCalledWith(expected)

    spy.mockRestore()
  })
})
