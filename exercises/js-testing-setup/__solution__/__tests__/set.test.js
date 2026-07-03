import { beforeEach, expect, test } from 'vitest';
import set from '../set.js';

let object;

beforeEach(() => {
  object = { a: [{ b: { c: 3 } }] };
});

test('set меняет значение по строковому пути', () => {
  set(object, 'a[0].b.c', 4);
  expect(object.a[0].b.c).toBe(4);
});

test('set добавляет значение по пути-массиву', () => {
  set(object, ['x', '0', 'y', 'z'], 5);
  expect(object.x[0].y.z).toBe(5);
  expect(object.a[0].b.c).toBe(3);
});

test('set возвращает тот же объект', () => {
  expect(set(object, 'a[0].b.c', 10)).toBe(object);
});
