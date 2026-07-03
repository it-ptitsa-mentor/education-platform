import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const fixturesPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "__fixtures__",
);

const loadClass = async () => {
  const mod = await import("../ConfigFactory.js");
  const ConfigFactory = mod.default ?? mod.ConfigFactory;
  if (typeof ConfigFactory !== "function" || typeof ConfigFactory.factory !== "function") {
    throw new Error("Экспортируйте класс ConfigFactory со статическим методом factory()");
  }
  return ConfigFactory;
};

describe("js-polymorphism-factory", () => {
  it("создает Config из yml-файла", async () => {
    const ConfigFactory = await loadClass();
    const config = ConfigFactory.factory(path.join(fixturesPath, "test.yml"));
    expect(config.getValue("key")).toBe("value");
    expect(config.getValue("host")).toBe("localhost");
    expect(config.constructor.name).toBe("Config");
  });

  it("поддерживает расширение yaml", async () => {
    const ConfigFactory = await loadClass();
    const config = ConfigFactory.factory(path.join(fixturesPath, "test.yaml"));
    expect(config.getValue("key")).toBe("another value");
  });

  it("создает Config из json-файла", async () => {
    const ConfigFactory = await loadClass();
    const config = ConfigFactory.factory(path.join(fixturesPath, "test.json"));
    expect(config.getValue("key")).toBe("json value");
    expect(config.getValue("port")).toBe("8080");
    expect(config.constructor.name).toBe("Config");
  });
});
