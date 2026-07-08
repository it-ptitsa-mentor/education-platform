// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { getUserFriends } from "../solution.ts";

const userJson = JSON.stringify({
  users: [
    { id: 1, name: 'John', age: 20 },
    { id: 2, name: 'Mary', age: 21 },
    { id: 3, name: 'Kate', age: 19 },
    { id: 4, name: 'Ann', age: 18 },
  ],
  friends: [
    [1, 2],
    [1, 3],
  ],
});

describe("typescript-basics-type-hierarcy: getUserFriends()", () => {
  it("returns friends of user 1", () => {
    const friends = getUserFriends(userJson, 1);
    expect(friends).toHaveLength(2);
    expect(friends.map((f: { name: string }) => f.name)).toContain('Mary');
    expect(friends.map((f: { name: string }) => f.name)).toContain('Kate');
  });
  it("returns friends of user 2", () => {
    const friends = getUserFriends(userJson, 2);
    expect(friends).toHaveLength(1);
    expect(friends[0].name).toBe('John');
  });
  it("returns empty array for user without friends", () => {
    expect(getUserFriends(userJson, 4)).toEqual([]);
  });
  it("returns empty array for nonexistent user", () => {
    expect(getUserFriends(userJson, 99)).toEqual([]);
  });
});
