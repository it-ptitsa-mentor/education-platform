import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../users.js");
  const fn = mod.default ?? mod.getMutualFriends;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getMutualFriends()");
  }
  return fn;
};

const loadMakeUser = async () => (await import("../user.js")).default;

describe("js-introduction-to-oop-encapsulation", () => {
  it("находит общих друзей", async () => {
    const getMutualFriends = await loadFunction();
    const makeUser = await loadMakeUser();
    const mutualFriend = makeUser({ id: 2 });
    const user1 = makeUser({
      friends: [makeUser({ id: 1 }), mutualFriend],
    });
    const user2 = makeUser({
      friends: [makeUser({ id: 2 }), makeUser({ id: 3 })],
    });
    const result = getMutualFriends(user1, user2);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it("возвращает пустой массив, если общих друзей нет", async () => {
    const getMutualFriends = await loadFunction();
    const makeUser = await loadMakeUser();
    const user1 = makeUser({ friends: [makeUser({ id: 1 })] });
    const user2 = makeUser({ friends: [makeUser({ id: 3 })] });
    expect(getMutualFriends(user1, user2)).toEqual([]);
  });
});
