import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../file.js");
  const fn = mod.getTypes ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getTypes");
  }
  return fn;
};

describe("js-asynchronous-programming-chain-of-promises", () => {
  it("определяет типы путей", async () => {
    const getTypes = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "types-"));
    const filepath = path.join(dir, "file.txt");
    fs.writeFileSync(filepath, "data");
    const result = await getTypes([dir, filepath, path.join(dir, "unknown")]);
    expect(result).toEqual(["directory", "file", null]);
  });
});
