import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../objects.js");
  const fn = mod.default ?? mod.fill;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

const data = { name: "Hexlet", state: "published" };

describe("js-objects-merging", () => {
  it("заполняет только разрешённые ключи", async () => {
    const fill = await loadFunction();
    const company = { name: null, state: "moderating" };
    const returned = fill(company, ["name"], data);
    expect(returned ?? company).toEqual({
      name: "Hexlet",
      state: "moderating",
    });
  });

  it("сливает все данные при пустом списке ключей", async () => {
    const fill = await loadFunction();
    const company = { name: null, state: "moderating" };
    const returned = fill(company, [], data);
    expect(returned ?? company).toEqual({
      name: "Hexlet",
      state: "published",
    });
  });
});
