// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { form } from "../solution.ts";

describe("typescript-basics-assignability: form", () => {
  it("name.validator passes for name.value", () => {
    expect(form.name.validator(form.name.value)).toBe(true);
  });
  it("age.validator fails for age.value", () => {
    expect(form.age.validator(form.age.value)).toBe(false);
  });
});
