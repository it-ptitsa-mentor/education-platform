import { describe, expect, it, vi } from "vitest";

const runStudentTests = async (implementation) => {
  vi.resetModules();
  vi.stubEnv("GET_IMPLEMENTATION", implementation);
  try {
    await import("../tests/collection.test.js");
  } finally {
    vi.unstubAllEnvs();
  }
};

describe("js-testing-goal", () => {
  it("тесты проходят на корректной реализации", async () => {
    await expect(runStudentTests("correct")).resolves.not.toThrow();
  });

  it("тесты ловят реализацию, всегда возвращающую значение по умолчанию", async () => {
    await expect(runStudentTests("alwaysDefault")).rejects.toThrow();
  });

  it("тесты ловят реализацию, игнорирующую значение по умолчанию", async () => {
    await expect(runStudentTests("ignoreDefault")).rejects.toThrow();
  });
});
