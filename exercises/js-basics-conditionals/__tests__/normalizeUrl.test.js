import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../normalizeUrl.js");
  const fn = mod.default ?? mod.normalizeUrl;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию normalizeUrl (export default)");
  }
  return fn;
};

describe("js-basics-conditionals", () => {
  it("добавляет https:// к адресу без префикса", async () => {
    const normalizeUrl = await loadFunction();
    expect(normalizeUrl("google.com")).toBe("https://google.com");
    expect(normalizeUrl("hexlet.io")).toBe("https://hexlet.io");
  });

  it("не дублирует https:// если префикс уже есть", async () => {
    const normalizeUrl = await loadFunction();
    expect(normalizeUrl("https://ai.fi")).toBe("https://ai.fi");
  });
});
