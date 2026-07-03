import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../solution.js");
  const fn = mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-introduction-to-oop-boxing", () => {
  it("оборачивает числа", async () => {
    const solution = await loadFunction();
    expect(solution(1) + "").toBe("Value is 1");
    expect(solution(10) + "").toBe("Value is 10");
  });

  it("оборачивает строки", async () => {
    const solution = await loadFunction();
    expect(solution("some value") + "").toBe("Value is some value");
    expect(`${solution("hexlet")}`).toBe("Value is hexlet");
  });
});
