import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const Sanitizer = (await import("../src/Sanitizer.js")).default;
  const SanitizerStripTagsDecorator = (
    await import("../src/SanitizerStripTagsDecorator.js")
  ).default;
  if (typeof Sanitizer !== "function") {
    throw new Error("Экспортируйте класс Sanitizer (export default)");
  }
  if (typeof SanitizerStripTagsDecorator !== "function") {
    throw new Error("Экспортируйте класс SanitizerStripTagsDecorator (export default)");
  }
  return { Sanitizer, SanitizerStripTagsDecorator };
};

describe("js-classes-composition-over-inheritance", () => {
  it("Sanitizer отрезает концевые пробелы", async () => {
    const { Sanitizer } = await loadAll();
    const sanitizer = new Sanitizer();
    expect(sanitizer.sanitize("text   ")).toBe("text");
    expect(sanitizer.sanitize(" boom ")).toBe("boom");
  });

  it("декоратор дополнительно удаляет теги", async () => {
    const { Sanitizer, SanitizerStripTagsDecorator } = await loadAll();
    const sanitizer = new SanitizerStripTagsDecorator(new Sanitizer());
    expect(sanitizer.sanitize("text   ")).toBe("text");
    expect(sanitizer.sanitize("<p>some text</p>")).toBe("some text");
    expect(sanitizer.sanitize(" <p> boom </p> ")).toBe("boom");
  });
});
