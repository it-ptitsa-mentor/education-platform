import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../timer.js");
  const fn = mod.default ?? mod.wait;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию wait (export default)");
  }
  return fn;
};

describe("js-asynchronous-programming-new-promise", () => {
  it("возвращает промис", async () => {
    const wait = await loadFunction();
    expect(wait(1)).toBeInstanceOf(Promise);
  });

  it("промис завершается не раньше указанного времени", async () => {
    const wait = await loadFunction();
    const start = Date.now();
    await wait(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(45);
  });
});
