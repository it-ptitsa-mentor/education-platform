// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { Company } from "../solution.ts";

describe("typescript-basics-modules: Company.isEmployeeEmail()", () => {
  it("returns true for employee email", () => {
    expect(Company.isEmployeeEmail('tirion@hexlet.io', 'hexlet.io')).toBe(true);
  });
  it("returns false for non-employee email", () => {
    expect(Company.isEmployeeEmail('user@example.com', 'hexlet.io')).toBe(false);
  });
  it("handles different domains", () => {
    expect(Company.isEmployeeEmail('admin@company.com', 'company.com')).toBe(true);
  });
});
