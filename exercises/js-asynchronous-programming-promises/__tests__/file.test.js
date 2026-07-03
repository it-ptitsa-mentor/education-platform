import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../file.js");
  const fn = mod.reverse ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию reverse");
  }
  return fn;
};

describe("js-asynchronous-programming-promises", () => {
  it("переворачивает строки файла", async () => {
    const reverse = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "reverse-"));
    const filepath = path.join(dir, "file.txt");
    fs.writeFileSync(filepath, "one\ntwo");
    await reverse(filepath);
    expect(fs.readFileSync(filepath, "utf-8")).toBe("two\none");
  });

  it("работает с несколькими строками", async () => {
    const reverse = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "reverse-"));
    const filepath = path.join(dir, "file.txt");
    fs.writeFileSync(filepath, "a\nb\nc\nd");
    await reverse(filepath);
    expect(fs.readFileSync(filepath, "utf-8")).toBe("d\nc\nb\na");
  });
});
