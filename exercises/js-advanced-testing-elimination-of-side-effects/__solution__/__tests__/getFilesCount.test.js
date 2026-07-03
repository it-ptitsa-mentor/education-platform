import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';
import getFilesCount from '../getFilesCount.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesPath = path.join(dirname, '..', '__fixtures__');

test('считает файлы во всех поддиректориях без побочных эффектов', () => {
  expect(getFilesCount(fixturesPath, () => {})).toBe(4);
});
