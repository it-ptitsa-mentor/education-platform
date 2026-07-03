import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../file.js");
  const fn = mod.getDirectorySize ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getDirectorySize");
  }
  return fn;
};

describe("js-asynchronous-programming-promise-all", () => {
  it("считает размер файлов директории без поддиректорий", async () => {
    const getDirectorySize = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirsize-"));
    fs.writeFileSync(path.join(dir, "a.txt"), "123");
    fs.writeFileSync(path.join(dir, "b.txt"), "12345");
    const subdir = path.join(dir, "sub");
    fs.mkdirSync(subdir);
    fs.writeFileSync(path.join(subdir, "c.txt"), "1234567890");
    expect(await getDirectorySize(dir)).toBe(8);
  });

  it("возвращает 0 для пустой директории", async () => {
    const getDirectorySize = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dirsize-"));
    expect(await getDirectorySize(dir)).toBe(0);
  });
});
