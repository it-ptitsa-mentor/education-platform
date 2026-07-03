import { expect, test } from 'vitest';
import sort from '../sort.js';

const buildRandomArray = () => {
  const length = Math.floor(Math.random() * 20);
  return Array.from(
    { length },
    () => Math.floor(Math.random() * 200) - 100,
  );
};

const isSorted = (coll) => coll.every(
  (item, index) => index === 0 || coll[index - 1] <= item,
);

test('сортирует по возрастанию (пример)', () => {
  expect(sort([3, 1, 0, 7, 5])).toEqual([0, 1, 3, 5, 7]);
  expect(sort([])).toEqual([]);
});

test('не мутирует исходный массив', () => {
  const numbers = [3, 1, 2];
  sort(numbers);
  expect(numbers).toEqual([3, 1, 2]);
});

test('свойства сортировки на случайных массивах', () => {
  for (let i = 0; i < 100; i += 1) {
    const numbers = buildRandomArray();
    const sorted = sort(numbers);
    expect(isSorted(sorted)).toBe(true);
    expect(sorted).toHaveLength(numbers.length);
    expect([...sorted].sort((a, b) => a - b)).toEqual(sorted);
    expect([...numbers].sort((a, b) => a - b)).toEqual(sorted);
  }
});
