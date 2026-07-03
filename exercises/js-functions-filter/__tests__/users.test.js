import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../users.js");
  const fn = mod.default ?? mod.getGirlFriends;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-functions-filter", () => {
  it("возвращает плоский список подруг", async () => {
    const getGirlFriends = await loadFunction();
    const users = [
      {
        name: "Tirion",
        friends: [
          { name: "Mira", gender: "female" },
          { name: "Ramsey", gender: "male" },
        ],
      },
      { name: "Bronn", friends: [] },
      {
        name: "Sam",
        friends: [
          { name: "Aria", gender: "female" },
          { name: "Keit", gender: "female" },
        ],
      },
      { name: "Rob", friends: [{ name: "Taywin", gender: "male" }] },
    ];
    expect(getGirlFriends(users)).toEqual([
      { name: "Mira", gender: "female" },
      { name: "Aria", gender: "female" },
      { name: "Keit", gender: "female" },
    ]);
  });

  it("возвращает пустой массив когда подруг нет", async () => {
    const getGirlFriends = await loadFunction();
    expect(getGirlFriends([])).toEqual([]);
    expect(
      getGirlFriends([{ name: "Solo", friends: [] }]),
    ).toEqual([]);
  });
});
