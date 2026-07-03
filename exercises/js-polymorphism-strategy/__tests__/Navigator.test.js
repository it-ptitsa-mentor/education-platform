import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../Navigator.js");
  const Navigator = mod.default ?? mod.Navigator;
  if (typeof Navigator !== "function") {
    throw new Error("Экспортируйте класс Navigator (export default)");
  }
  return Navigator;
};

describe("js-polymorphism-strategy", () => {
  it("walking используется по умолчанию и идёт по порядку", async () => {
    const Navigator = await loadClass();
    const navigator = new Navigator([
      "street1", "street2", "street3", "street4", "street5",
    ]);
    expect(navigator.goToNextTurn()).toBe("street2");
    expect(navigator.goToNextTurn()).toBe("street3");
    expect(navigator.goToNextTurn()).toBe("street4");
    expect(navigator.goToNextTurn()).toBe("street5");
    expect(navigator.goToNextTurn()).toBeNull();
  });

  it("driving перепрыгивает через одну локацию", async () => {
    const Navigator = await loadClass();
    const navigator = new Navigator(
      ["street1", "street2", "street3", "street4"],
      "driving",
    );
    expect(navigator.goToNextTurn()).toBe("street3");
    expect(navigator.goToNextTurn()).toBeNull();
  });

  it("driving попадает точно в последнюю локацию", async () => {
    const Navigator = await loadClass();
    const navigator = new Navigator(
      ["street1", "street2", "street3", "street4", "street5"],
      "driving",
    );
    expect(navigator.goToNextTurn()).toBe("street3");
    expect(navigator.goToNextTurn()).toBe("street5");
    expect(navigator.goToNextTurn()).toBeNull();
  });
});
