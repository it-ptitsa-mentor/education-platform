import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../strings.js");
  const fn = mod.default ?? mod.buildDefinitionList;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-build-strings", () => {
  it("собирает HTML-список определений", async () => {
    const buildDefinitionList = await loadFunction();
    const definitions = [
      ["Блямба", "Выпуклость, утолщения на поверхности чего-либо"],
      ["Бобр", "Животное из отряда грызунов"],
    ];
    expect(buildDefinitionList(definitions)).toBe(
      "<dl><dt>Блямба</dt><dd>Выпуклость, утолщения на поверхности чего-либо</dd><dt>Бобр</dt><dd>Животное из отряда грызунов</dd></dl>",
    );
  });

  it("возвращает пустую строку для пустого массива", async () => {
    const buildDefinitionList = await loadFunction();
    expect(buildDefinitionList([])).toBe("");
  });
});
