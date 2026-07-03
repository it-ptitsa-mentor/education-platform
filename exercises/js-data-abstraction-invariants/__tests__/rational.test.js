import { describe, expect, it } from "vitest";

const loadModule = async () => {
  const mod = await import("../rational.js");
  const required = ["makeRational", "getNumer", "getDenom", "add", "sub"];
  for (const name of required) {
    if (typeof mod[name] !== "function") {
      throw new Error(`Экспортируйте функцию ${name}()`);
    }
  }
  return mod;
};

describe("js-data-abstraction-invariants", () => {
  it("нормализует дробь при создании", async () => {
    const { makeRational, getNumer, getDenom } = await loadModule();
    const rat = makeRational(3, 9);
    expect(getNumer(rat)).toBe(1);
    expect(getDenom(rat)).toBe(3);
  });

  it("складывает дроби", async () => {
    const { makeRational, getNumer, getDenom, add } = await loadModule();
    const rat = add(makeRational(3, 9), makeRational(10, 3));
    expect(getNumer(rat)).toBe(11);
    expect(getDenom(rat)).toBe(3);
  });

  it("вычитает дроби", async () => {
    const { makeRational, getNumer, getDenom, sub } = await loadModule();
    const rat = sub(makeRational(3, 9), makeRational(10, 3));
    expect(getNumer(rat)).toBe(-3);
    expect(getDenom(rat)).toBe(1);
  });

  it("держит знак в числителе", async () => {
    const { makeRational, getNumer, getDenom } = await loadModule();
    const rat = makeRational(4, -8);
    expect(getNumer(rat)).toBe(-1);
    expect(getDenom(rat)).toBe(2);
  });
});
