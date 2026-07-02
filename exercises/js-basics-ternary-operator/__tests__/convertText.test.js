import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../convertText.js");
  const fn = mod.default ?? mod.convertText;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию convertText (export default)");
  }
  return fn;
};

describe("js-basics-ternary-operator", () => {
  it("не меняет строку с заглавной первой буквой", async () => {
    const convertText = await loadFunction();
    expect(convertText("Hello")).toBe("Hello");
  });

  it("переворачивает строку со строчной первой буквой", async () => {
    const convertText = await loadFunction();
    expect(convertText("hello")).toBe("olleh");
  });

  it("возвращает пустую строку для пустого входа", async () => {
    const convertText = await loadFunction();
    expect(convertText("")).toBe("");
  });
});
