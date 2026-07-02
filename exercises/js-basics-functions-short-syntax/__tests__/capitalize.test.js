import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../capitalize.js");
  const fn = mod.default ?? mod.capitalize;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию capitalize (export default)");
  }
  return fn;
};

describe("js-basics-functions-short-syntax", () => {
  it("делает первую букву заглавной", async () => {
    const capitalize = await loadFunction();
    expect(capitalize("arya")).toBe("Arya");
    expect(capitalize("hexlet")).toBe("Hexlet");
  });

  it("не меняет уже заглавную букву и остальную строку", async () => {
    const capitalize = await loadFunction();
    expect(capitalize("Bran")).toBe("Bran");
    expect(capitalize("winter is coming")).toBe("Winter is coming");
  });
});
