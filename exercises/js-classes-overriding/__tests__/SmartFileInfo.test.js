import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "__fixtures__",
  "sample.txt",
);

const loadClass = async () => {
  const mod = await import("../SmartFileInfo.js");
  const SmartFileInfo = mod.default ?? mod.SmartFileInfo;
  if (typeof SmartFileInfo !== "function") {
    throw new Error("Экспортируйте класс SmartFileInfo (export default)");
  }
  return SmartFileInfo;
};

describe("js-classes-overriding", () => {
  it("возвращает размер в байтах по умолчанию и по 'b'", async () => {
    const SmartFileInfo = await loadClass();
    const file = new SmartFileInfo(fixturePath);
    expect(file.getSize()).toBe(11);
    expect(file.getSize("b")).toBe(11);
  });

  it("возвращает размер в килобайтах по 'kb'", async () => {
    const SmartFileInfo = await loadClass();
    const file = new SmartFileInfo(fixturePath);
    expect(file.getSize("kb")).toBe(11 / 1024);
  });

  it("бросает Error для неизвестной единицы измерения", async () => {
    const SmartFileInfo = await loadClass();
    const file = new SmartFileInfo(fixturePath);
    expect(() => file.getSize("udav")).toThrow(Error);
  });
});
