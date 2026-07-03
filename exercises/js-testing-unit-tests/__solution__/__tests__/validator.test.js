import { expect, test } from 'vitest';
import makeValidator from '../validator.js';

test('без проверок любое значение валидно', () => {
  const validator = makeValidator();
  expect(validator.isValid('some value')).toBe(true);
});

test('одна проверка', () => {
  const validator = makeValidator();
  validator.addCheck((v) => v > 5);
  expect(validator.isValid(7)).toBe(true);
  expect(validator.isValid(3)).toBe(false);
});

test('проверки накапливаются', () => {
  const validator = makeValidator();
  validator.addCheck((v) => v > 5);
  validator.addCheck((v) => v % 2 === 0);
  expect(validator.isValid(3)).toBe(false);
  expect(validator.isValid(4)).toBe(false);
  expect(validator.isValid(7)).toBe(false);
  expect(validator.isValid(8)).toBe(true);
});
