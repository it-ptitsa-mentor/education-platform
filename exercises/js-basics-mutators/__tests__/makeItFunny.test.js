import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../makeItFunny.js");
  const fn = mod.default ?? mod.makeItFunny;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию makeItFunny (export default)");
  }
  return fn;
};

describe("js-basics-mutators", () => {
  it("переводит каждый n-ный символ в верхний регистр", async () => {
    const makeItFunny = await loadFunction();
    expect(makeItFunny("I never look back", 3)).toBe("I NevEr LooK bAck");
  });

  it("работает с другим шагом", async () => {
    const makeItFunny = await loadFunction();
    expect(makeItFunny("abcdef", 2)).toBe("aBcDeF");
  });
});
