import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.default ?? mod.get;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию get по умолчанию (export default)");
  }
  return fn;
};

const cities = ["moscow", "london", "berlin", "porto", "", null, undefined];

describe("js-arrays-isset", () => {
  it("возвращает элемент по существующему индексу", async () => {
    const get = await loadFunction();
    expect(get(cities, 1)).toBe("london");
    expect(get(cities, 4)).toBe("");
  });

  it("возвращает значение по умолчанию для несуществующего индекса", async () => {
    const get = await loadFunction();
    expect(get(cities, 10, "paris")).toBe("paris");
    expect(get(cities, -1, "oops")).toBe("oops");
    expect(get(cities, 7)).toBeNull();
  });

  it("существующий индекс важнее значения: null и undefined возвращаются как есть", async () => {
    const get = await loadFunction();
    expect(get(cities, 5, "oops")).toBeNull();
    expect(get(cities, 6, "oops")).toBeUndefined();
  });
});
