import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../domain.js");
  const fn = mod.default ?? mod.getDomainInfo;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-objects-using", () => {
  it("берёт http по умолчанию без протокола", async () => {
    const getDomainInfo = await loadFunction();
    expect(getDomainInfo("yandex.ru")).toEqual({
      scheme: "http",
      name: "yandex.ru",
    });
  });

  it("извлекает протокол из адреса", async () => {
    const getDomainInfo = await loadFunction();
    expect(getDomainInfo("https://hexlet.io")).toEqual({
      scheme: "https",
      name: "hexlet.io",
    });
    expect(getDomainInfo("http://google.com")).toEqual({
      scheme: "http",
      name: "google.com",
    });
  });
});
