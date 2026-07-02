import { afterEach, describe, expect, it, vi } from "vitest";

const loadFunction = async () => {
  const mod = await import("../company.js");
  const fn = mod.default ?? mod.make;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-objects-spread", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("создаёт компанию со значениями по умолчанию", async () => {
    const make = await loadFunction();
    vi.spyOn(Date, "now").mockReturnValue(1700000000000);
    expect(make("Hexlet")).toEqual({
      name: "Hexlet",
      state: "moderating",
      createdAt: 1700000000000,
    });
  });

  it("дополнительные свойства перекрывают значения по умолчанию", async () => {
    const make = await loadFunction();
    vi.spyOn(Date, "now").mockReturnValue(1700000000000);
    expect(make("Hexlet", { website: "hexlet.io", state: "published" })).toEqual({
      name: "Hexlet",
      website: "hexlet.io",
      state: "published",
      createdAt: 1700000000000,
    });
  });
});
