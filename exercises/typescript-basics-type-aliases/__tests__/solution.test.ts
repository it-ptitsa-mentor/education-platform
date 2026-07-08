// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { getOlderUser } from "../solution.ts";

describe("typescript-basics-type-aliases: getOlderUser()", () => {
  it("returns the older user", () => {
    const user1 = { name: 'Petr', age: 8 };
    const user2 = { name: 'John', age: 30 };
    expect(getOlderUser(user1, user2)).toEqual(user2);
    expect(getOlderUser(user2, user1)).toEqual(user2);
  });
  it("returns null when ages are equal", () => {
    const user1 = { name: 'A', age: 25 };
    const user2 = { name: 'B', age: 25 };
    expect(getOlderUser(user1, user2)).toBeNull();
  });
});
