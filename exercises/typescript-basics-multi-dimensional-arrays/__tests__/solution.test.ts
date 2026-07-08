// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { getField } from "../solution.ts";

describe("typescript-basics-multi-dimensional-arrays: getField()", () => {
  it("creates a field filled with null", () => {
    expect(getField(1)).toEqual([[null]]);
    expect(getField(2)).toEqual([[null, null], [null, null]]);
    expect(getField(3)).toEqual([[null, null, null], [null, null, null], [null, null, null]]);
  });
  it("field size equals parameter", () => {
    const field = getField(3);
    expect(field).toHaveLength(3);
    expect(field[0]).toHaveLength(3);
  });
});
