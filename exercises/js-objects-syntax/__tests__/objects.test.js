import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../objects.js");
  const fn = mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-objects-syntax", () => {
  it("возвращает объект ровно с двумя нужными свойствами", async () => {
    const make = await loadFunction();
    expect(make()).toEqual({ file: "src/objects.js", config: true });
  });
});
