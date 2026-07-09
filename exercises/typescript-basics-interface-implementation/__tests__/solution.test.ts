// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { Phonebook } from "../solution.ts";

describe("typescript-basics-interface-implementation: Phonebook", () => {
  it("set and get a phone number", () => {
    const book = new Phonebook();
    book.set("help", 911);
    expect(book.get("help")).toBe(911);
  });

  it("returns null for unknown name", () => {
    const book = new Phonebook();
    expect(book.get("unknown")).toBeNull();
  });

  it("entries object stores all added entries", () => {
    const book = new Phonebook();
    book.set("Alice", 111);
    book.set("Bob", 222);
    expect(book.entries["Alice"]).toBe(111);
    expect(book.entries["Bob"]).toBe(222);
  });
});
