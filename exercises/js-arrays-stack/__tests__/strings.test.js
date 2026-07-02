import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../strings.js");
  const fn = mod.default ?? mod.isBracketStructureBalanced;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-stack", () => {
  it("принимает сбалансированные структуры", async () => {
    const isBalanced = await loadFunction();
    expect(isBalanced("()")).toBe(true);
    expect(isBalanced("[()]")).toBe(true);
    expect(isBalanced("({}[])")).toBe(true);
    expect(isBalanced("")).toBe(true);
  });

  it("отклоняет несбалансированные структуры", async () => {
    const isBalanced = await loadFunction();
    expect(isBalanced("(>")).toBe(false);
    expect(isBalanced("{<>}}")).toBe(false);
    expect(isBalanced("([)]")).toBe(false);
    expect(isBalanced("(")).toBe(false);
  });
});
