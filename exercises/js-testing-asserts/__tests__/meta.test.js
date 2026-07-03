import { describe, expect, it, vi } from "vitest";

const runStudentTests = async (implementation) => {
  vi.resetModules();
  vi.stubEnv("TAKE_IMPLEMENTATION", implementation);
  try {
    await import("../tests/take.test.js");
  } finally {
    vi.unstubAllEnvs();
  }
};

describe("js-testing-asserts", () => {
  it("тесты проходят на корректной реализации", async () => {
    await expect(runStudentTests("correct")).resolves.not.toThrow();
  });

  it("тесты ловят реализацию без значения по умолчанию", async () => {
    await expect(runStudentTests("noDefault")).rejects.toThrow();
  });

  it("тесты ловят реализацию, ломающуюся на отрицательном n", async () => {
    await expect(runStudentTests("brokenNegative")).rejects.toThrow();
  });
});
