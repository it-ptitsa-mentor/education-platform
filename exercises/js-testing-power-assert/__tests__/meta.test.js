import { describe, expect, it, vi } from "vitest";

const runStudentTests = async (implementation) => {
  vi.resetModules();
  vi.stubEnv("INDEXOF_IMPLEMENTATION", implementation);
  try {
    await import("../tests/indexOf.test.js");
  } finally {
    vi.unstubAllEnvs();
  }
};

describe("js-testing-power-assert", () => {
  it("тесты проходят на корректной реализации", async () => {
    await expect(runStudentTests("correct")).resolves.not.toThrow();
  });

  it("тесты ловят реализацию, игнорирующую fromIndex", async () => {
    await expect(runStudentTests("ignoreFromIndex")).rejects.toThrow();
  });

  it("тесты ловят реализацию, возвращающую 0 вместо -1", async () => {
    await expect(runStudentTests("zeroWhenMissing")).rejects.toThrow();
  });
});
