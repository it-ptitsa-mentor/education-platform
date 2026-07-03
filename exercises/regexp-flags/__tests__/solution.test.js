import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const content = fs.readFileSync(path.join(dirname, "..", "solution"), "utf-8");
const [pattern = "", flags = ""] = content.trim().split("\n").map((line) => line.trim());

const makeRegexp = () => new RegExp(pattern, flags);

const matches = ["she said \"python\"", "'PyThon'", "\"pYThon\""];
const nonMatches = ["python", "\"ruby\"", "\"python"];

describe("regexp-flags", () => {
  it("паттерн не пустой", () => {
    expect(pattern).not.toBe("");
  });

  it.each(matches)("находит: %s", (str) => {
    expect(makeRegexp().test(str)).toBe(true);
  });

  it.each(nonMatches)("не находит: %s", (str) => {
    expect(makeRegexp().test(str)).toBe(false);
  });
});
