import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const fixturesPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "__fixtures__",
);

const loadClass = async () => {
  const mod = await import("../DatabaseConfigLoader.js");
  const Loader = mod.default ?? mod.DatabaseConfigLoader;
  if (typeof Loader !== "function") {
    throw new Error("Экспортируйте класс DatabaseConfigLoader (export default)");
  }
  return Loader;
};

describe("js-polymorphism-dispatch-by-file", () => {
  it("загружает конфигурацию по окружению", async () => {
    const DatabaseConfigLoader = await loadClass();
    const loader = new DatabaseConfigLoader(fixturesPath);
    expect(loader.load("production")).toEqual({
      host: "google.com",
      username: "postgres",
    });
  });

  it("поддерживает extend: сливает конфигурации без ключа extend", async () => {
    const DatabaseConfigLoader = await loadClass();
    const loader = new DatabaseConfigLoader(fixturesPath);
    expect(loader.load("staging")).toEqual({
      host: "staging.server",
      password: "admin",
      username: "dev",
      port: 5432,
    });
  });
});
