import { expect, test } from 'vitest';
import without from '../without.js';

test('without исключает переданные значения', () => {
  expect(without([2, 1, 2, 3], 1, 2)).toEqual([3]);
});

test('without возвращает копию без исключений, если значения не переданы', () => {
  const coll = [1, 2, 3];
  expect(without(coll)).toEqual([1, 2, 3]);
  expect(without(coll)).not.toBe(coll);
});

test('without с пустым массивом', () => {
  expect(without([], 1)).toEqual([]);
});
