// @vitest-environment jsdom
import { fileURLToPath as __toPath } from 'node:url';
import __nodePath from 'node:path';
const __dirname = __nodePath.dirname(__toPath(import.meta.url));
// @ts-check

import { beforeAll, test, expect } from 'vitest'

import fs from 'fs'
import path from 'path'
import testingLibraryDom from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import run from '../src/application.js'

const { screen } = testingLibraryDom

const getCell = (rowIndex, cellIndex) => {
  const table = document.querySelector('table')
  return table.rows.item(rowIndex).cells.item(cellIndex)
}

beforeAll(() => {
  const htmlPath = path.resolve(__dirname, '..', '__fixtures__', 'index.html')
  const initHtml = fs.readFileSync(htmlPath).toString()
  document.body.innerHTML = initHtml
  run()
})

test('application', () => {
  const root = screen.getByTestId('root')
  const table = screen.getByRole('table')
  expect(root).toContainElement(table)
  expect(getCell(0, 0)).toHaveTextContent('s')
  expect(getCell(1, 1)).toHaveTextContent('s')
  expect(getCell(2, 2)).toHaveTextContent('s')
})

const cells = [
  [2, 2, 'x'],
  [1, 1, 'o'],
  [1, 2, 'x'],
  [2, 1, 'o'],
  [2, 1, 'o'],
  [0, 0, 'x'],
  [1, 0, 'o'],
  [2, 0, 'x'],
  [0, 2, 'o'],
]

test.each(cells)('Row %s, column %s, set "%s"', async (row, column, symbol) => {
  const cellBeforeClick = getCell(row, column)
  await userEvent.click(cellBeforeClick)
  const cellAfterClick = getCell(row, column)
  const regex = new RegExp(`^${symbol}$`)
  expect(cellAfterClick).toHaveTextContent(regex)
})
