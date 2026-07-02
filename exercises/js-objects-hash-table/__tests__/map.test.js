import { describe, expect, it } from "vitest";

const loadModule = async () => {
  const mod = await import("../map.js");
  for (const name of ["make", "set", "get"]) {
    if (typeof mod[name] !== "function") {
      throw new Error(`Экспортируйте функцию ${name}`);
    }
  }
  return mod;
};

describe("js-objects-hash-table", () => {
  it("возвращает null или значение по умолчанию для пустого словаря", async () => {
    const { make, get } = await loadModule();
    const map = make();
    expect(get(map, "key")).toBeNull();
    expect(get(map, "key", "default_value")).toBe("default_value");
  });

  it("set/get: записывает и читает значение по ключу", async () => {
    const { make, set, get } = await loadModule();
    const map = make();
    expect(set(map, "key2", "value2")).toBe(true);
    expect(get(map, "key2")).toBe("value2");
  });

  it("set перезаписывает значение существующего ключа", async () => {
    const { make, set, get } = await loadModule();
    const map = make();
    set(map, "key", "first");
    expect(set(map, "key", "second")).toBe(true);
    expect(get(map, "key")).toBe("second");
  });

  it("хранит несколько ключей независимо", async () => {
    const { make, set, get } = await loadModule();
    const map = make();
    set(map, "one", 1);
    set(map, "two", 2);
    expect(get(map, "one")).toBe(1);
    expect(get(map, "two")).toBe(2);
  });
});
