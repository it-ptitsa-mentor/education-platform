import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const Guest = (await import("../Guest.js")).default;
  const User = (await import("../User.js")).default;
  const getGreeting = (await import("../helpers.js")).default;
  if (typeof Guest !== "function" || typeof User !== "function") {
    throw new Error("Экспортируйте классы Guest и User (export default)");
  }
  if (typeof getGreeting !== "function") {
    throw new Error("Экспортируйте функцию getGreeting (export default)");
  }
  return { Guest, User, getGreeting };
};

describe("js-polymorphism-breaking-polymorphism", () => {
  it("приветствует гостя", async () => {
    const { Guest, getGreeting } = await loadAll();
    expect(getGreeting(new Guest())).toBe("Nice to meet you Guest!");
  });

  it("приветствует пользователя по имени", async () => {
    const { User, getGreeting } = await loadAll();
    expect(getGreeting(new User("Petr"))).toBe("Hello Petr!");
    expect(getGreeting(new User("Anna"))).toBe("Hello Anna!");
  });
});
