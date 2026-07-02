import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../company.js");
  const fn = mod.default ?? mod.is;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-objects-references", () => {
  it("возвращает true для одинаковых по данным объектов", async () => {
    const is = await loadFunction();
    const company1 = {
      name: "Hexlet",
      state: "published",
      website: "https://hexlet.io",
    };
    const company2 = {
      name: "Hexlet",
      state: "published",
      website: "https://hexlet.io",
    };
    expect(is(company1, company2)).toBe(true);
  });

  it("возвращает false при различии данных", async () => {
    const is = await loadFunction();
    expect(
      is(
        { name: "Hexlet", state: "moderating", website: "https://hexlet.io" },
        {
          name: "CodeBasics",
          state: "published",
          website: "https://code-basics.com",
        },
      ),
    ).toBe(false);
    expect(
      is(
        { name: "Hexlet", state: "moderating", website: "https://hexlet.io" },
        { name: "Hexlet", state: "published", website: "https://hexlet.io" },
      ),
    ).toBe(false);
  });
});
