// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { newYearCongratulate } from "../solution.ts";

describe("typescript-basics-function-overloads: newYearCongratulate()", () => {
  it("congratulates with name only", () => {
    expect(newYearCongratulate('John')).toBe('Hi John! Happy New Year!');
  });
  it("congratulates with year and name", () => {
    expect(newYearCongratulate(2023, 'Mila')).toBe('Hi Mila! Happy New Year 2023!');
  });
});
