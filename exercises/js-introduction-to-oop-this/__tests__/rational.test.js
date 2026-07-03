import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../rational.js");
  const fn = mod.default ?? mod.make;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-introduction-to-oop-this", () => {
  it("сеттеры и геттеры работают", async () => {
    const make = await loadFunction();
    const rat = make();
    rat.setNumer(3);
    rat.setDenom(8);
    expect(rat.getNumer()).toBe(3);
    expect(rat.getDenom()).toBe(8);
  });

  it("принимает числитель и знаменатель в конструкторе", async () => {
    const make = await loadFunction();
    const rat = make(10, 3);
    expect(rat.getNumer()).toBe(10);
    expect(rat.getDenom()).toBe(3);
    expect(rat.toString()).toBe("10/3");
  });

  it("add складывает дроби и не мутирует исходную", async () => {
    const make = await loadFunction();
    const rat1 = make();
    rat1.setNumer(3);
    rat1.setDenom(8);
    const rat2 = make(10, 3);
    const rat3 = rat1.add(rat2);
    expect(rat3.toString()).toBe("89/24");
    expect(rat1.getNumer()).toBe(3);
    expect(rat1.getDenom()).toBe(8);
  });
});
