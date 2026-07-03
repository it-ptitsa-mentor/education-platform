import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../index.js");
  const fn = mod.default ?? mod.getInvalidBooks;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getInvalidBooks (export default)");
  }
  return fn;
};

describe("js-object-oriented-design-builder", () => {
  it("находит книги без обязательных полей", async () => {
    const getInvalidBooks = await loadFunction();
    const books = [
      { name: "book", author: "author" },
      { author: "author 2" },
      { name: "book 3" },
    ];
    expect(getInvalidBooks(books)).toEqual([
      { author: "author 2" },
      { name: "book 3" },
    ]);
  });

  it("проверяет необязательные поля", async () => {
    const getInvalidBooks = await loadFunction();
    const valid = {
      name: "book",
      author: "author",
      pagesCount: 100,
      link: "https://example.com/book",
      genre: "fantasy",
    };
    const badPages = { name: "b", author: "a", pagesCount: -5 };
    const badLink = { name: "b", author: "a", link: "" };
    const badGenre = { name: "b", author: "a", genre: "cooking" };
    expect(getInvalidBooks([valid, badPages, badLink, badGenre])).toEqual([
      badPages,
      badLink,
      badGenre,
    ]);
  });

  it("возвращает пустой массив, если все книги валидны", async () => {
    const getInvalidBooks = await loadFunction();
    expect(getInvalidBooks([{ name: "book", author: "author" }])).toEqual([]);
  });
});
