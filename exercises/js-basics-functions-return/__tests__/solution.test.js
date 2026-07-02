import { describe, expect, it } from "vitest";

describe("js-basics-functions-return", () => {
  it("sayHurrayThreeTimes возвращает тройное ура", async () => {
    const mod = await import("../solution.js");
    const sayHurrayThreeTimes = mod.default ?? mod.sayHurrayThreeTimes;
    if (typeof sayHurrayThreeTimes !== "function") {
      throw new Error(
        "Экспортируйте функцию sayHurrayThreeTimes (export default)",
      );
    }

    expect(sayHurrayThreeTimes()).toBe("hurray! hurray! hurray!");
  });
});
