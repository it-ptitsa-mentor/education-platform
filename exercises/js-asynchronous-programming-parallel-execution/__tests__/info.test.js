import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../info.js");
  const fn = mod.getDirectorySize ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getDirectorySize");
  }
  return fn;
};

const getSize = (fn, dirpath) => new Promise((resolve) => {
  fn(dirpath, (err, size) => resolve({ err, size }));
});

describe("js-asynchronous-programming-parallel-execution", () => {
  it("считает размер директории без поддиректорий", async () => {
    const getDirectorySize = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "parsize-"));
    fs.writeFileSync(path.join(dir, "a.txt"), "1234");
    fs.writeFileSync(path.join(dir, "b.txt"), "12");
    fs.mkdirSync(path.join(dir, "sub"));
    const { err, size } = await getSize(getDirectorySize, dir);
    expect(err).toBeFalsy();
    expect(size).toBe(6);
  });

  it("передаёт ошибку в колбек для несуществующей директории", async () => {
    const getDirectorySize = await loadFunction();
    const { err } = await getSize(getDirectorySize, "/nonexistent/dir");
    expect(err).toBeTruthy();
  });
});
