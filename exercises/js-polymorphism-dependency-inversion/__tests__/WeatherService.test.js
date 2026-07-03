import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../WeatherService.js");
  const WeatherService = mod.default ?? mod.WeatherService;
  if (typeof WeatherService !== "function") {
    throw new Error("Экспортируйте класс WeatherService (export default)");
  }
  return WeatherService;
};

const makeFakeClient = (dataByCity) => {
  const requests = [];
  return {
    requests,
    get: async (url) => {
      requests.push(url);
      const city = url.split("/").pop();
      return { data: dataByCity[city] };
    },
  };
};

describe("js-polymorphism-dependency-inversion", () => {
  it("возвращает данные погоды по городу через внедрённый клиент", async () => {
    const WeatherService = await loadClass();
    const client = makeFakeClient({
      berlin: { name: "berlin", temperature: 11 },
    });
    const service = new WeatherService(client);
    const data = await service.getWeather("berlin");
    expect(data).toEqual({ name: "berlin", temperature: 11 });
  });

  it("запрашивает правильный урл сервиса погоды", async () => {
    const WeatherService = await loadClass();
    const client = makeFakeClient({
      monaco: { name: "monaco", temperature: 26 },
    });
    const service = new WeatherService(client);
    await service.getWeather("monaco");
    expect(client.requests).toHaveLength(1);
    expect(client.requests[0]).toContain("/api/v2/cities/monaco");
  });
});
