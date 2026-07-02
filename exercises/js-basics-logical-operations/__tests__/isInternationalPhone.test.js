import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../isInternationalPhone.js");
  const fn = mod.default ?? mod.isInternationalPhone;
  if (typeof fn !== "function") {
    throw new Error(
      "Экспортируйте функцию isInternationalPhone (export default)",
    );
  }
  return fn;
};

describe("js-basics-logical-operations", () => {
  it("распознаёт международный формат", async () => {
    const isInternationalPhone = await loadFunction();
    expect(isInternationalPhone("+79602223423")).toBe(true);
  });

  it("отклоняет номер без плюса", async () => {
    const isInternationalPhone = await loadFunction();
    expect(isInternationalPhone("89602223423")).toBe(false);
  });
});
