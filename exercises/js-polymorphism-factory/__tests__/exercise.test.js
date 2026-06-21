import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-polymorphism-factory", () => {
  it("parsers/YamlParser.js", () => {
    const content = readFileSync(path.join(exerciseDir, "parsers/YamlParser.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("ConfigFactory.js", () => {
    const content = readFileSync(path.join(exerciseDir, "ConfigFactory.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("parsers/JsonParser.js", () => {
    const content = readFileSync(path.join(exerciseDir, "parsers/JsonParser.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
