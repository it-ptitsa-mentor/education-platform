import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../strings.js");
  const fn = mod.default ?? mod.countUniqChars;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-set-theory", () => {
  it("считает уникальные символы", async () => {
    const countUniqChars = await loadFunction();
    expect(countUniqChars("yyab")).toBe(3);
    expect(countUniqChars("yy")).toBe(1);
    expect(countUniqChars("You know nothing Jon Snow")).toBe(13);
  });

  it("возвращает 0 для пустой строки", async () => {
    const countUniqChars = await loadFunction();
    expect(countUniqChars("")).toBe(0);
  });
});
