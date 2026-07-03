import { beforeEach, expect, test } from 'vitest';
import makeCart from '../cart.js';

let cart;

beforeEach(() => {
  cart = makeCart();
});

test('пустая корзина', () => {
  expect(cart.getItems()).toEqual([]);
  expect(cart.getCost()).toBe(0);
  expect(cart.getCount()).toBe(0);
});

test('добавление товаров', () => {
  cart.addItem({ name: 'car', price: 3 }, 5);
  cart.addItem({ name: 'house', price: 10 }, 2);
  expect(cart.getItems()).toHaveLength(2);
  expect(cart.getCost()).toBe(35);
  expect(cart.getCount()).toBe(7);
});

test('одинаковые товары добавляются отдельными пунктами', () => {
  cart.addItem({ name: 'house', price: 10 }, 2);
  cart.addItem({ name: 'house', price: 10 }, 1);
  expect(cart.getItems()).toHaveLength(2);
  expect(cart.getCost()).toBe(30);
  expect(cart.getCount()).toBe(3);
});
