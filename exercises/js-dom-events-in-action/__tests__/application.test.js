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

beforeAll(() => {
  const htmlPath = path.resolve(__dirname, '..', '__fixtures__', 'index.html')
  const initHtml = fs.readFileSync(htmlPath).toString()
  document.body.innerHTML = initHtml
  run()
})

test('user tabs', async () => {
  const userSettingsTab1 = screen.getByRole('tab', { name: 'User settings' })
  const userSettingsContentTab1 = screen.getByText('User settings tab')
  expect(userSettingsTab1).not.toHaveClass('active')
  expect(userSettingsContentTab1).not.toHaveClass('active')

  await userEvent.click(userSettingsTab1)
  const userHomeTab2 = screen.getByRole('tab', { name: 'User home' })
  const userSettingsTab2 = screen.getByRole('tab', { name: 'User settings' })
  expect(userHomeTab2).not.toHaveClass('active')
  expect(userSettingsTab2).toHaveClass('active')

  const userHomeContentTab1 = screen.getByText('User home tab')
  expect(userHomeContentTab1).not.toHaveClass('active')
  const userSettingsContentTab2 = screen.getByText('User settings tab')
  expect(userSettingsContentTab2).toHaveClass('active')
})

test('app tabs', async () => {
  const appSettingsTab1 = screen.getByRole('tab', { name: 'Messages settings' })
  const appSettingsContentTab1 = screen.getByText('Messages settings tab')
  expect(appSettingsTab1).not.toHaveClass('active')
  expect(appSettingsContentTab1).not.toHaveClass('active')

  await userEvent.click(appSettingsTab1)
  const appSettingsTab2 = screen.getByRole('tab', { name: 'Messages settings' })
  const appSettingsContentTab2 = screen.getByText('Messages settings tab')
  expect(appSettingsTab2).toHaveClass('active')
  expect(appSettingsContentTab2).toHaveClass('active')

  const appMessagesTab1 = screen.getByRole('tab', { name: 'Messages' })
  const appMessagesContentTab1 = screen.getByText('Messages tab')
  expect(appMessagesTab1).not.toHaveClass('active')
  expect(appMessagesContentTab1).not.toHaveClass('active')
})

test('user tabs after app', async () => {
  const userSettingsTab1 = screen.getByRole('tab', { name: 'User settings' })
  const userSettingsContentTab1 = screen.getByText('User settings tab')
  expect(userSettingsTab1).toHaveClass('active')
  expect(userSettingsContentTab1).toHaveClass('active')

  await userEvent.click(userSettingsTab1)
  const userSettingsTab2 = screen.getByRole('tab', { name: 'User settings' })
  const userSettingsContentTab2 = screen.getByText('User settings tab')
  expect(userSettingsTab2).toHaveClass('active')
  expect(userSettingsContentTab2).toHaveClass('active')

  const userProfileTab1 = screen.getByRole('tab', { name: 'User profile' })
  const userProfileContentTab1 = screen.getByText('User profile tab')
  expect(userProfileTab1).not.toHaveClass('active')
  expect(userProfileContentTab1).not.toHaveClass('active')

  await userEvent.click(userProfileTab1)
  const userProfileTab2 = screen.getByRole('tab', { name: 'User profile' })
  const userProfileContentTab2 = screen.getByText('User profile tab')
  expect(userProfileTab2).toHaveClass('active')
  expect(userProfileContentTab2).toHaveClass('active')

  const userSettingsTab3 = screen.getByRole('tab', { name: 'User settings' })
  const userSettingsContentTab3 = screen.getByText('User settings tab')
  expect(userSettingsTab3).not.toHaveClass('active')
  expect(userSettingsContentTab3).not.toHaveClass('active')
})

test('app tabs after user', async () => {
  const appSettingsTab1 = screen.getByRole('tab', { name: 'Messages settings' })
  const appSettingsContentTab1 = screen.getByText('Messages settings tab')
  expect(appSettingsTab1).toHaveClass('active')
  expect(appSettingsContentTab1).toHaveClass('active')

  const appMessagesTab2 = screen.getByRole('tab', { name: 'Messages' })
  await userEvent.click(appMessagesTab2)
  const appSettingsTab2 = screen.getByRole('tab', { name: 'Messages settings' })
  const appSettingsContentTab2 = screen.getByText('Messages settings tab')
  expect(appSettingsTab2).not.toHaveClass('active')
  expect(appSettingsContentTab2).not.toHaveClass('active')

  const appMessagesTab3 = screen.getByRole('tab', { name: 'Messages' })
  const appMessagesContentTab3 = screen.getByText('Messages tab')
  expect(appMessagesTab3).toHaveClass('active')
  expect(appMessagesContentTab3).toHaveClass('active')
})
