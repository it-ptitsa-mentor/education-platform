// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { Car } from "../solution.ts";

describe("typescript-basics-interfaces-overview: Car", () => {
  it("calculates fuel needed for a given distance", () => {
    const porsche = new Car(4, "red", true, 20);
    expect(porsche.calcFuelNeeded(200)).toBe(40);
  });

  it("stores constructor properties", () => {
    const car = new Car(2, "blue", false, 10);
    expect(car.doors).toBe(2);
    expect(car.color).toBe("blue");
    expect(car.automatic).toBe(false);
    expect(car.fuelConsumption).toBe(10);
  });

  it("calcFuelNeeded scales linearly", () => {
    const car = new Car(4, "white", true, 5);
    expect(car.calcFuelNeeded(100)).toBe(5);
    expect(car.calcFuelNeeded(0)).toBe(0);
  });
});
