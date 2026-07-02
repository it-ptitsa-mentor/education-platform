import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../getNumberExplanation.js");
  const fn = mod.default ?? mod.getNumberExplanation;
  if (typeof fn !== "function") {
    throw new Error(
      "Экспортируйте функцию getNumberExplanation (export default)",
    );
  }
  return fn;
};

describe("js-basics-switch", () => {
  it("объясняет специальные числа", async () => {
    const getNumberExplanation = await loadFunction();
    expect(getNumberExplanation(666)).toBe("devil number");
    expect(getNumberExplanation(42)).toBe("answer for everything");
    expect(getNumberExplanation(7)).toBe("prime number");
  });

  it("возвращает just a number для остальных", async () => {
    const getNumberExplanation = await loadFunction();
    expect(getNumberExplanation(8)).toBe("just a number");
    expect(getNumberExplanation(0)).toBe("just a number");
  });
});
