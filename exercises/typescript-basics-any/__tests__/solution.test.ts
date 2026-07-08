// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { getParams } from "../solution.ts";

describe("typescript-basics-any: getParams()", () => {
  it("parses query string into object", () => {
    expect(getParams('per=10&page=5')).toEqual({ per: '10', page: '5' });
    expect(getParams('name=hexlet&count=3&order=asc')).toEqual({ name: 'hexlet', count: '3', order: 'asc' });
    expect(getParams('')).toEqual({});
  });
});
