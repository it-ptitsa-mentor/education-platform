import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../Url.js");
  const Url = mod.default ?? mod.Url;
  if (typeof Url !== "function") {
    throw new Error("Экспортируйте класс Url (export default)");
  }
  return Url;
};

describe("js-object-oriented-design-modeling", () => {
  it("парсит схему и хост", async () => {
    const Url = await loadClass();
    const url = new Url("http://yandex.ru:80?key=value&key2=value2");
    expect(url.getScheme()).toBe("http");
    expect(url.getHostName()).toBe("yandex.ru");
  });

  it("возвращает query-параметры", async () => {
    const Url = await loadClass();
    const url = new Url("http://yandex.ru:80?key=value&key2=value2");
    expect(url.getQueryParams()).toEqual({ key: "value", key2: "value2" });
    expect(url.getQueryParam("key")).toBe("value");
    expect(url.getQueryParam("key2", "lala")).toBe("value2");
    expect(url.getQueryParam("new", "ehu")).toBe("ehu");
    expect(url.getQueryParam("new")).toBeNull();
  });

  it("сравнивает адреса через equals", async () => {
    const Url = await loadClass();
    const url = new Url("http://yandex.ru:80?key=value&key2=value2");
    expect(url.equals(new Url("http://yandex.ru:80?key=value&key2=value2"))).toBe(true);
    expect(url.equals(new Url("http://yandex.ru:80?key=value"))).toBe(false);
  });
});
