import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../solution.js");
  const Truncater = mod.default ?? mod.Truncater;
  if (typeof Truncater !== "function") {
    throw new Error("Экспортируйте класс Truncater (export default)");
  }
  return Truncater;
};

describe("js-object-oriented-design-configuration-setters", () => {
  it("короткий текст возвращается как есть", async () => {
    const Truncater = await loadClass();
    const truncater = new Truncater();
    expect(truncater.truncate("one two")).toBe("one two");
  });

  it("опции метода переопределяют опции по умолчанию", async () => {
    const Truncater = await loadClass();
    const truncater = new Truncater();
    expect(truncater.truncate("one two", { length: 6 })).toBe("one tw...");
  });

  it("опции конструктора и метода комбинируются", async () => {
    const Truncater = await loadClass();
    const truncater = new Truncater({ length: 6 });
    expect(truncater.truncate("one two", { separator: "." })).toBe("one tw.");
    expect(truncater.truncate("one two", { length: 3 })).toBe("one...");
    expect(truncater.truncate("one two")).toBe("one tw...");
  });
});
