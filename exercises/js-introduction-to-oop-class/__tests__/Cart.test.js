import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../Cart.js");
  const Cart = mod.default ?? mod.Cart;
  if (typeof Cart !== "function") {
    throw new Error("Экспортируйте класс Cart (export default)");
  }
  return Cart;
};

describe("js-introduction-to-oop-class", () => {
  it("addItem и getItems", async () => {
    const Cart = await loadClass();
    const cart = new Cart();
    cart.addItem({ name: "car", price: 3 }, 5);
    cart.addItem({ name: "house", price: 10 }, 2);
    expect(cart.getItems()).toEqual([
      { item: { name: "car", price: 3 }, count: 5 },
      { item: { name: "house", price: 10 }, count: 2 },
    ]);
  });

  it("getCost учитывает количество", async () => {
    const Cart = await loadClass();
    const cart = new Cart();
    cart.addItem({ name: "car", price: 3 }, 5);
    cart.addItem({ name: "house", price: 10 }, 2);
    expect(cart.getCost()).toBe(35);
  });

  it("пустая корзина", async () => {
    const Cart = await loadClass();
    const cart = new Cart();
    expect(cart.getItems()).toEqual([]);
    expect(cart.getCost()).toBe(0);
    expect(cart.getCount()).toBe(0);
  });

  it("getCount считает товары", async () => {
    const Cart = await loadClass();
    const cart = new Cart();
    cart.addItem({ name: "car", price: 3 }, 1);
    cart.addItem({ name: "house", price: 10 }, 1);
    expect(cart.getCount()).toBe(2);
  });
});
