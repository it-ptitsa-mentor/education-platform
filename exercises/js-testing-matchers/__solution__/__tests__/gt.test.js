import { expect, test } from 'vitest';
import gt from '../gt.js';

test('gt возвращает true, когда первое больше второго', () => {
  expect(gt(3, 1)).toBe(true);
});

test('gt возвращает false при равенстве', () => {
  expect(gt(3, 3)).toBe(false);
});

test('gt возвращает false, когда первое меньше второго', () => {
  expect(gt(1, 3)).toBe(false);
});
