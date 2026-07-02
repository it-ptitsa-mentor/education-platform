import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../objects.js");
  const fn = mod.default ?? mod.cloneShallow;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-objects-shallow-cloning", () => {
  it("копия равна по структуре, но является новым объектом", async () => {
    const cloneShallow = await loadFunction();
    const data = {
      key: "value",
      key2: { key: "innerValue", innerKey: { anotherKey: "anotherValue" } },
    };
    const result = cloneShallow(data);
    expect(result).toEqual(data);
    expect(result).not.toBe(data);
  });

  it("копирование поверхностное: вложенные объекты общие", async () => {
    const cloneShallow = await loadFunction();
    const data = { nested: { a: 1 } };
    const result = cloneShallow(data);
    expect(result.nested).toBe(data.nested);
  });
});
