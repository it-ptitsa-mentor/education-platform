// @ts-check

import { beforeAll, test, expect } from 'vitest'
import '@testing-library/jest-dom'
import fs from 'fs'
import path from 'path'
import testingLibraryDom from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import run from '../src/application.js'

const { screen } = testingLibraryDom

const getAllAlerts = () => document.querySelectorAll('div.alerts div')

beforeAll(() => {
  const htmlPath = path.resolve(__dirname, '..', '__fixtures__', 'index.html')
  const initHtml = fs.readFileSync(htmlPath).toString()
  document.body.innerHTML = initHtml
  run()
})

test('application', async () => {
  // попробуйте использовать отладку: https://help.hexlet.io/code-and-test-errors/otladka-v-uprazhneniyah-po-frontendu
  // screen.debug();
  const button = screen.getByText('Generate Alert')
  expect(getAllAlerts()).toHaveLength(0)

  // screen.debug(button);
  await userEvent.click(button)
  const allAlerts1 = getAllAlerts()
  expect(allAlerts1).toHaveLength(1)

  const [alert1] = allAlerts1
  expect(alert1).toHaveTextContent('Alert 1')
  expect(alert1).toHaveClass('alert alert-primary')

  await userEvent.click(button)
  await userEvent.click(button)
  const allAlerts2 = getAllAlerts()
  expect(allAlerts2).toHaveLength(3)

  const [alert3] = allAlerts2
  expect(alert3).toHaveTextContent('Alert 3')
  expect(alert3).toHaveClass('alert alert-primary')
})
