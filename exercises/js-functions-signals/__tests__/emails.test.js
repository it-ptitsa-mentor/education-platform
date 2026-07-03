import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../emails.js");
  const fn = mod.default ?? mod.getFreeDomainsCount;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getFreeDomainsCount (export default)");
  }
  return fn;
};

describe("js-functions-signals", () => {
  it("считает количество емейлов на бесплатных доменах", async () => {
    const getFreeDomainsCount = await loadFunction();
    const emails = [
      "info@gmail.com",
      "info@yandex.ru",
      "info@hotmail.com",
      "mk@host.com",
      "support@hexlet.io",
      "key@yandex.ru",
      "sergey@gmail.com",
      "vovan@gmail.com",
      "vovan@hotmail.com",
    ];
    expect(getFreeDomainsCount(emails)).toEqual({
      "gmail.com": 3,
      "yandex.ru": 2,
      "hotmail.com": 2,
    });
  });

  it("возвращает пустой объект, если бесплатных доменов нет", async () => {
    const getFreeDomainsCount = await loadFunction();
    expect(getFreeDomainsCount(["info@host.com", "support@hexlet.io"])).toEqual({});
    expect(getFreeDomainsCount([])).toEqual({});
  });
});
