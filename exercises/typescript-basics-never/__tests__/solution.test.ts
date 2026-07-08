// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { fail } from "../solution.ts";

describe("typescript-basics-never: fail()", () => {
  it("always throws an error", () => {
    expect(() => fail('test error')).toThrow('test error');
    expect(() => fail('another error')).toThrow('another error');
  });
});
