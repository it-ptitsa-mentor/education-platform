import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, vi } from 'vitest';
import getFilesCount from '../getFilesCount.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(dirname, '..', '__fixtures__');

test('логирует Go! ровно один раз', () => {
  const log = vi.fn();
  getFilesCount(fixturesPath, log);
  expect(log).toHaveBeenCalledTimes(1);
  expect(log).toHaveBeenCalledWith('Go!');
});
