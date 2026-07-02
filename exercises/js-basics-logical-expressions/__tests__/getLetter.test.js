import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../getLetter.js");
  const fn = mod.default ?? mod.getLetter;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getLetter (export default)");
  }
  return fn;
};

describe("js-basics-logical-expressions", () => {
  it("возвращает символ по порядковому номеру", async () => {
    const getLetter = await loadFunction();
    expect(getLetter("Hexlet", 1)).toBe("H");
    expect(getLetter("Hexlet", 6)).toBe("t");
  });

  it("возвращает пустую строку вне диапазона", async () => {
    const getLetter = await loadFunction();
    expect(getLetter("Hexlet", 0)).toBe("");
    expect(getLetter("Hexlet", 11)).toBe("");
  });
});
