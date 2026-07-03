import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const InMemoryKV = (await import("../InMemoryKV.js")).default;
  const swapKeyValue = (await import("../keyValueFunctions.js")).default;
  if (typeof InMemoryKV !== "function") {
    throw new Error("Экспортируйте класс InMemoryKV (export default)");
  }
  if (typeof swapKeyValue !== "function") {
    throw new Error("Экспортируйте функцию swapKeyValue (export default)");
  }
  return { InMemoryKV, swapKeyValue };
};

describe("js-polymorphism-polymorphism", () => {
  it("InMemoryKV: get/set/unset/toObject", async () => {
    const { InMemoryKV } = await loadAll();
    const map = new InMemoryKV({ key: 10 });
    expect(map.get("key")).toBe(10);
    expect(map.get("unknownkey")).toBeNull();
    expect(map.get("unknownkey", "default value")).toBe("default value");

    map.set("key2", "value2");
    expect(map.get("key2")).toBe("value2");

    map.unset("key2");
    expect(map.get("key2")).toBeNull();

    expect(map.toObject()).toEqual({ key: 10 });
  });

  it("toObject возвращает копию", async () => {
    const { InMemoryKV } = await loadAll();
    const map = new InMemoryKV({ key: "value" });
    const data = map.toObject();
    data.key = "changed";
    expect(map.get("key")).toBe("value");
  });

  it("swapKeyValue меняет ключи и значения местами", async () => {
    const { InMemoryKV, swapKeyValue } = await loadAll();
    const map = new InMemoryKV({ key: 10 });
    map.set("key2", "value2");
    swapKeyValue(map);
    expect(map.get("key")).toBeNull();
    expect(map.get(10)).toBe("key");
    expect(map.get("value2")).toBe("key2");
  });
});
