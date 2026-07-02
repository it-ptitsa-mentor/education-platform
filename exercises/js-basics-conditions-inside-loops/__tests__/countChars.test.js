import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../countChars.js");
  const fn = mod.default ?? mod.countChars;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию countChars (export default)");
  }
  return fn;
};

describe("js-basics-conditions-inside-loops", () => {
  it("считает символы без учёта регистра", async () => {
    const countChars = await loadFunction();
    expect(countChars("HexlEt", "e")).toBe(2);
    expect(countChars("HexlEt", "E")).toBe(2);
  });

  it("возвращает 0 когда символа нет", async () => {
    const countChars = await loadFunction();
    expect(countChars("hexlet", "z")).toBe(0);
  });

  it("учитывает повторения в длинной строке", async () => {
    const countChars = await loadFunction();
    expect(countChars("Mama mila ramu", "m")).toBe(4);
  });
});
