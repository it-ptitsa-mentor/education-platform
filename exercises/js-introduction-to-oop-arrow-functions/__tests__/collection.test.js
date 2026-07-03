import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../collection.js");
  const fn = mod.default ?? mod.each;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию each (export default)");
  }
  return fn;
};

describe("js-introduction-to-oop-arrow-functions", () => {
  it("устанавливает объекты коллекции как контекст колбека", async () => {
    const each = await loadFunction();
    const objects = [{ name: "Karl" }, { name: "Mia" }];
    each(objects, function callback() {
      this.name = this.name.split("").reverse().join("");
    });
    expect(objects).toEqual([{ name: "lraK" }, { name: "aiM" }]);
  });

  it("вызывает колбек для каждого объекта", async () => {
    const each = await loadFunction();
    const visited = [];
    const objects = [{ id: 1 }, { id: 2 }, { id: 3 }];
    each(objects, function callback() {
      visited.push(this.id);
    });
    expect(visited).toEqual([1, 2, 3]);
  });
});
