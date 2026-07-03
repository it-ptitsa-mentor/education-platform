import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../math.js");
  const fn = mod.default ?? mod.average;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию average (export default)");
  }
  return fn;
};

describe("js-functions-rest-operator", () => {
  it("возвращает среднее арифметическое аргументов", async () => {
    const average = await loadFunction();
    expect(average(0)).toBe(0);
    expect(average(0, 10)).toBe(5);
    expect(average(-3, 4, 2, 10)).toBe(3.25);
  });

  it("возвращает null без аргументов", async () => {
    const average = await loadFunction();
    expect(average()).toBeNull();
  });
});
