import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../solution.js");
  const fn = mod.default ?? mod.convert;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию convert (export default)");
  }
  return fn;
};

describe("js-functions-spread-operator", () => {
  it("конвертирует даты в человеко-читаемые строки", async () => {
    const convert = await loadFunction();
    expect(convert([1993, 4, 24])).toEqual(["Sat Apr 24 1993"]);
    expect(convert([1993, 4, 24], [1997, 9, 12], [2001, 11, 18])).toEqual([
      "Sat Apr 24 1993",
      "Fri Sep 12 1997",
      "Sun Nov 18 2001",
    ]);
  });

  it("возвращает пустой массив без аргументов", async () => {
    const convert = await loadFunction();
    expect(convert()).toEqual([]);
  });
});
