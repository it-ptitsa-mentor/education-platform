import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';
import prettifyHTMLFile from '../prettifyHTMLFile.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const getFixturePath = (name) => path.join(dirname, '..', '__fixtures__', name);

test('форматирует html-файл', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prettify-'));
  const filepath = path.join(tmpDir, 'index.html');
  fs.copyFileSync(getFixturePath('source.html'), filepath);
  await prettifyHTMLFile(filepath);
  const expected = fs.readFileSync(getFixturePath('result.html'), 'utf-8');
  expect(fs.readFileSync(filepath, 'utf-8')).toBe(expected);
});
