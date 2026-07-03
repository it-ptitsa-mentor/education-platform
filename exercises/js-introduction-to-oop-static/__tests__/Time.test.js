import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../Time.js");
  const Time = mod.default ?? mod.Time;
  if (typeof Time !== "function") {
    throw new Error("Экспортируйте класс Time (export default)");
  }
  return Time;
};

describe("js-introduction-to-oop-static", () => {
  it("конструктор и toString работают", async () => {
    const Time = await loadClass();
    const time = new Time(10, 15);
    expect(`The time is ${time}`).toBe("The time is 10:15");
  });

  it("fromString создает объект Time из строки", async () => {
    const Time = await loadClass();
    const time = Time.fromString("10:23");
    expect(time).toBeInstanceOf(Time);
    expect(`The time is ${time}`).toBe("The time is 10:23");
    expect(`${Time.fromString("7:45")}`).toBe("7:45");
  });
});
