import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../html.js");
  const fn = mod.default ?? mod.getLinks;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getLinks (export default)");
  }
  return fn;
};

describe("js-polymorphism-dispatch-data-by-key", () => {
  it("извлекает ссылки из тегов a, link и img", async () => {
    const getLinks = await loadFunction();
    const tags = [
      { name: "img", src: "hexlet.io/assets/logo.png" },
      { name: "div" },
      { name: "link", href: "hexlet.io/assets/style.css" },
      { name: "h1" },
      { name: "a", href: "hexlet.io/courses" },
    ];
    expect(getLinks(tags)).toEqual([
      "hexlet.io/assets/logo.png",
      "hexlet.io/assets/style.css",
      "hexlet.io/courses",
    ]);
  });

  it("возвращает пустой массив, если ссылок нет", async () => {
    const getLinks = await loadFunction();
    expect(getLinks([{ name: "div" }, { name: "h1" }])).toEqual([]);
    expect(getLinks([])).toEqual([]);
  });
});
