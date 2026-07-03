import { expect, test } from 'vitest';
import buildUser from '../buildUser.js';

test('возвращает объект нужной структуры', () => {
  const user = buildUser();
  expect(Object.keys(user).sort()).toEqual(['email', 'firstName', 'lastName']);
  expect(typeof user.email).toBe('string');
});

test('каждый вызов возвращает другие данные', () => {
  expect(buildUser()).not.toEqual(buildUser());
});

test('свойства можно задать через параметры', () => {
  const user = buildUser({ firstName: 'Petya' });
  expect(user.firstName).toBe('Petya');
  expect(user.email).toEqual(expect.any(String));
});
