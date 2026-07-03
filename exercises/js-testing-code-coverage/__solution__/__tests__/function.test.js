import { expect, test } from 'vitest';
import getDaysInMonth from '../implementations/getDaysInMonth.js';

test('обычные месяцы', () => {
  expect(getDaysInMonth(4, 2023)).toBe(30);
  expect(getDaysInMonth(1, 2023)).toBe(31);
  expect(getDaysInMonth(12, 2023)).toBe(31);
});

test('несуществующий месяц', () => {
  expect(getDaysInMonth(0, 2023)).toBeNull();
  expect(getDaysInMonth(13, 2023)).toBeNull();
});

test('февраль в невисокосном году', () => {
  expect(getDaysInMonth(2, 2023)).toBe(28);
});

test('февраль в високосном году', () => {
  expect(getDaysInMonth(2, 2024)).toBe(29);
});

test('правила 100 и 400 лет', () => {
  expect(getDaysInMonth(2, 1900)).toBe(28);
  expect(getDaysInMonth(2, 2000)).toBe(29);
});
