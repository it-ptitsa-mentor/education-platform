// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { sanitize } from "../solution.ts";

describe("typescript-basics-mapped-types: sanitize()", () => {
  it("removes specified keys from object", () => {
    const user = sanitize(
      { name: "John", password: "1q2w3e", token: "test" },
      ["password", "token"],
    );
    expect(user).toEqual({ name: "John" });
  });

  it("returns a new object (does not mutate original)", () => {
    const original = { a: 1, b: 2, c: 3 };
    const result = sanitize(original, ["b"]);
    expect(result).toEqual({ a: 1, c: 3 });
    expect(original).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("returns same object if no keys to remove", () => {
    const obj = { x: 1, y: 2 };
    expect(sanitize(obj, [])).toEqual({ x: 1, y: 2 });
  });
});
