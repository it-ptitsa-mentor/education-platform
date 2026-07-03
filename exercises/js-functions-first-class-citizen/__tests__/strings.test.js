import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../strings.js");
  const fn = mod.default ?? mod.run;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию run (export default)");
  }
  return fn;
};

describe("js-functions-first-class-citizen", () => {
  it("возвращает последние 4 символа в обратном порядке", async () => {
    const run = await loadFunction();
    expect(run("power")).toBe("rewo");
    expect(run("hexlet")).toBe("telx");
  });

  it("возвращает null для пустой и короткой строки", async () => {
    const run = await loadFunction();
    expect(run("")).toBeNull();
    expect(run("cb")).toBeNull();
  });
});
