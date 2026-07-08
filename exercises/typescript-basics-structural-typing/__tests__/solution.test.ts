// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { LoadingStatus, handleData } from "../solution.ts";
import type { DataState } from "../solution.ts";

describe("typescript-basics-structural-typing: handleData()", () => {
  it("returns loading string", () => {
    const loading: DataState = { status: LoadingStatus.Loading };
    expect(handleData(loading)).toBe('loading...');
  });
  it("returns error message", () => {
    const error: DataState = { status: LoadingStatus.Error, error: new Error('some error') };
    expect(handleData(error)).toBe('some error');
  });
  it("returns data as string", () => {
    const success: DataState = { status: LoadingStatus.Success, data: 42 };
    expect(handleData(success)).toBe('42');
  });
});
