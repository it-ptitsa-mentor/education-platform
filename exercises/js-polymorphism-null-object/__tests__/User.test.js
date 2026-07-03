import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const Subscription = (await import("../Subscription.js")).default;
  const User = (await import("../User.js")).default;
  const FakeSubscription = (await import("../FakeSubscription.js")).default;
  if (typeof User !== "function") {
    throw new Error("Экспортируйте класс User (export default)");
  }
  if (typeof FakeSubscription !== "function") {
    throw new Error("Экспортируйте класс FakeSubscription (export default)");
  }
  return { Subscription, User, FakeSubscription };
};

describe("js-polymorphism-null-object", () => {
  it("реальная подписка используется, если передана", async () => {
    const { Subscription, User } = await loadAll();
    const user1 = new User("vasya@email.com", new Subscription("premium"));
    expect(user1.getCurrentSubscription().hasPremiumAccess()).toBe(true);
    expect(user1.getCurrentSubscription().hasProfessionalAccess()).toBe(false);

    const user2 = new User("vasya@email.com", new Subscription("professional"));
    expect(user2.getCurrentSubscription().hasPremiumAccess()).toBe(false);
    expect(user2.getCurrentSubscription().hasProfessionalAccess()).toBe(true);
  });

  it("без подписки создаётся фейковая с запретом доступа", async () => {
    const { User } = await loadAll();
    const user = new User("vasya@email.com");
    expect(user.getCurrentSubscription().hasPremiumAccess()).toBe(false);
    expect(user.getCurrentSubscription().hasProfessionalAccess()).toBe(false);
  });

  it("администратору фейковая подписка разрешает всё", async () => {
    const { User } = await loadAll();
    const admin = new User("rakhim@hexlet.io");
    expect(admin.getCurrentSubscription().hasPremiumAccess()).toBe(true);
    expect(admin.getCurrentSubscription().hasProfessionalAccess()).toBe(true);
  });
});
