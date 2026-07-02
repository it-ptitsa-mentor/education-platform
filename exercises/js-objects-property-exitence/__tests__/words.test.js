import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../words.js");
  const fn = mod.default ?? mod.countWords;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-objects-property-exitence", () => {
  it("считает слова без учёта регистра", async () => {
    const countWords = await loadFunction();
    expect(countWords("one two three two ONE one wow")).toEqual({
      one: 3,
      two: 2,
      three: 1,
      wow: 1,
    });
    expect(
      countWords("another one sentence with strange Words words"),
    ).toEqual({
      another: 1,
      one: 1,
      sentence: 1,
      with: 1,
      strange: 1,
      words: 2,
    });
  });

  it("возвращает пустой объект для пустой строки", async () => {
    const countWords = await loadFunction();
    expect(countWords("")).toEqual({});
  });
});
