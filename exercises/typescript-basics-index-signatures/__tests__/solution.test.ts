// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { buildSalaryStatistics } from "../solution.ts";

describe("typescript-basics-index-signatures: buildSalaryStatistics()", () => {
  it("calculates min, max and avg salaries", () => {
    const employees = {
      Ivan: 100,
      John: 50,
      Maria: 150,
      ironMan: 1000,
    };
    const stats = buildSalaryStatistics(employees);
    expect(stats.min).toBe(50);
    expect(stats.max).toBe(1000);
    expect(stats.avg).toBe(325);
  });

  it("works with a single employee", () => {
    const stats = buildSalaryStatistics({ Alice: 200 });
    expect(stats.min).toBe(200);
    expect(stats.max).toBe(200);
    expect(stats.avg).toBe(200);
  });
});
