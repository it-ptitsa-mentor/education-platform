import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../objects.js");
  const fn = mod.default ?? mod.get;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

const data = {
  user: "ubuntu",
  hosts: {
    0: { name: "web1" },
    1: { name: "web2", null: 3, active: false },
  },
};

describe("js-objects-nested-objects", () => {
  it("извлекает значения по цепочке ключей", async () => {
    const get = await loadFunction();
    expect(get(data, ["user"])).toBe("ubuntu");
    expect(get(data, ["hosts", 1, "name"])).toBe("web2");
    expect(get(data, ["hosts", 0])).toEqual({ name: "web1" });
    expect(get(data, ["hosts", 1, null])).toBe(3);
    expect(get(data, ["hosts", 1, "active"])).toBe(false);
  });

  it("возвращает null для недостижимого пути", async () => {
    const get = await loadFunction();
    expect(get(data, ["undefined"])).toBeNull();
    expect(get(data, ["user", "ubuntu"])).toBeNull();
  });

  it("возвращает весь объект для пустой цепочки", async () => {
    const get = await loadFunction();
    expect(get(data, [])).toEqual(data);
  });
});
