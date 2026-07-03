import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../solution.js");
  const fn = mod.default ?? mod.normalize;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию normalize (export default)");
  }
  return fn;
};

describe("js-object-oriented-design-fluent-interface", () => {
  it("нормализует, сортирует и группирует города по странам", async () => {
    const normalize = await loadFunction();
    const countries = [
      { name: "Miami", country: "usa" },
      { name: "samarA", country: "  ruSsiA" },
      { name: "Moscow ", country: " Russia" },
    ];
    expect(normalize(countries)).toEqual({
      russia: ["moscow", "samara"],
      usa: ["miami"],
    });
  });

  it("убирает дубликаты городов и работает с пустым входом", async () => {
    const normalize = await loadFunction();
    const countries = [
      { name: "Paris", country: "France" },
      { name: " paris", country: "france " },
    ];
    expect(normalize(countries)).toEqual({ france: ["paris"] });
    expect(normalize([])).toEqual({});
  });
});
