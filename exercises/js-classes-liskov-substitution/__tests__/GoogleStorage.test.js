import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../src/GoogleStorage.js");
  const GoogleStorage = mod.default ?? mod.GoogleStorage;
  if (typeof GoogleStorage !== "function") {
    throw new Error("Экспортируйте класс GoogleStorage (export default)");
  }
  return GoogleStorage;
};

describe("js-classes-liskov-substitution", () => {
  it("set и get работают", async () => {
    const GoogleStorage = await loadClass();
    const storage = new GoogleStorage();
    storage.set("one", "two");
    expect(storage.get("one")).toBe("two");
  });

  it("count() бросает Error", async () => {
    const GoogleStorage = await loadClass();
    const storage = new GoogleStorage();
    storage.set("one", "two");
    expect(() => storage.count()).toThrow(Error);
  });
});
