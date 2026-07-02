import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../truncate.js");
  const fn = mod.default ?? mod.truncate;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию truncate (export default)");
  }
  return fn;
};

describe("js-basics-functions-parameters", () => {
  it("обрезает строку и добавляет многоточие", async () => {
    const truncate = await loadFunction();
    expect(truncate("hexlet", 2)).toBe("he...");
    expect(truncate("it works!", 4)).toBe("it w...");
    expect(truncate("hello", 3)).toBe("hel...");
  });
});
