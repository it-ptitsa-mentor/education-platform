// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { removeKeys } from "../solution.ts";

describe("typescript-basics-object: removeKeys()", () => {
  it("removes specified keys from object", () => {
    const user = {
      name: "Tirion",
      email: "tirion@lanister.got",
      age: 35,
    };
    expect(removeKeys(user, ["email", "age"])).toEqual({ name: "Tirion" });
  });

  it("does not mutate the original object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    removeKeys(obj, ["b"]);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("returns same structure if no keys to remove", () => {
    const obj = { x: 1, y: 2 };
    expect(removeKeys(obj, [])).toEqual({ x: 1, y: 2 });
  });
});
