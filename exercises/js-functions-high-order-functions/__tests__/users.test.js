import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../users.js");
  const fn = mod.default ?? mod.takeOldest;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию takeOldest (export default)");
  }
  return fn;
};

const users = [
  { name: "Tirion", birthday: "Nov 19, 1988" },
  { name: "Sam", birthday: "Nov 22, 1999" },
  { name: "Rob", birthday: "Jan 11, 1975" },
  { name: "Sansa", birthday: "Mar 20, 2001" },
  { name: "Tisha", birthday: "Feb 27, 1992" },
  { name: "Chris", birthday: "Dec 25, 1995" },
];

describe("js-functions-high-order-functions", () => {
  it("возвращает самого взрослого по умолчанию", async () => {
    const takeOldest = await loadFunction();
    expect(takeOldest(users)).toEqual([
      { name: "Rob", birthday: "Jan 11, 1975" },
    ]);
  });

  it("возвращает n самых взрослых", async () => {
    const takeOldest = await loadFunction();
    expect(takeOldest(users, 2)).toEqual([
      { name: "Rob", birthday: "Jan 11, 1975" },
      { name: "Tirion", birthday: "Nov 19, 1988" },
    ]);
  });

  it("не мутирует исходный список", async () => {
    const takeOldest = await loadFunction();
    const copy = [...users];
    takeOldest(users, 3);
    expect(users).toEqual(copy);
  });
});
