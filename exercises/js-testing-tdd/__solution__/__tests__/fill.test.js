import { expect, test } from 'vitest';
import fill from '../fill.js';

test('fill заполняет диапазон', () => {
  const array = [1, 2, 3, 4];
  fill(array, '*', 1, 3);
  expect(array).toEqual([1, '*', '*', 4]);
});

test('fill заполняет весь массив по умолчанию', () => {
  const array = [1, 2, 3, 4];
  fill(array, '*');
  expect(array).toEqual(['*', '*', '*', '*']);
});

test('fill со start за пределами массива ничего не меняет', () => {
  const array = [1, 2, 3, 4];
  fill(array, '*', 4);
  expect(array).toEqual([1, 2, 3, 4]);
});

test('fill с end больше длины массива', () => {
  const array = [1, 2, 3, 4];
  fill(array, '*', 0, 10);
  expect(array).toEqual(['*', '*', '*', '*']);
});
