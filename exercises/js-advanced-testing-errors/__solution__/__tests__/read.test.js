import os from 'node:os';
import { expect, test } from 'vitest';
import read from '../read.js';

test('бросает исключение, если файл не найден', () => {
  expect(() => read('/undefined')).toThrow();
});

test('бросает исключение, если передан путь до директории', () => {
  expect(() => read(os.tmpdir())).toThrow();
});
