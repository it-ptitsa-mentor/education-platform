// @ts-check
import { expect, test, vi } from 'vitest'

const getPathToSolution = () => `${process.cwd()}/solution.ts`

test('hello world', async () => {
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { })
  await import(getPathToSolution())

  const firstArg = consoleLogSpy.mock.calls.join('\n')

  expect(firstArg).toBe('Hello, World!')
})
