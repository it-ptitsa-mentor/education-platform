import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';
import toHtmlList from '../toHtmlList.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const getFixturePath = (name) => path.join(dirname, '..', '__fixtures__', name);
const expected = fs.readFileSync(getFixturePath('result.html'), 'utf-8').trim();

test.each(['list.yml', 'list.json', 'list.csv'])('toHtmlList(%s)', (name) => {
  expect(toHtmlList(getFixturePath(name))).toBe(expected);
});
