import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../objects.js");
  const fn = mod.default ?? mod.pick;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

const data = { user: "ubuntu", cores: 4, os: "linux" };

describe("js-objects-for-of", () => {
  it("выбирает указанные свойства", async () => {
    const pick = await loadFunction();
    expect(pick(data, ["user"])).toEqual({ user: "ubuntu" });
    expect(pick(data, ["user", "os"])).toEqual({
      user: "ubuntu",
      os: "linux",
    });
  });

  it("игнорирует несуществующие свойства", async () => {
    const pick = await loadFunction();
    expect(pick(data, ["none", "cores"])).toEqual({ cores: 4 });
  });

  it("возвращает пустой объект для пустого списка ключей", async () => {
    const pick = await loadFunction();
    expect(pick(data, [])).toEqual({});
  });
});
