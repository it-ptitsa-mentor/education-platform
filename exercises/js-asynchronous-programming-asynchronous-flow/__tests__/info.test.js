import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../info.js");
  const fn = mod.compareFileSizes ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию compareFileSizes");
  }
  return fn;
};

const compare = (fn, path1, path2) => new Promise((resolve, reject) => {
  fn(path1, path2, (err, result) => (err ? reject(err) : resolve(result)));
});

describe("js-asynchronous-programming-asynchronous-flow", () => {
  it("сравнивает размеры файлов", async () => {
    const compareFileSizes = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sizes-"));
    const big = path.join(dir, "big");
    const small = path.join(dir, "small");
    const same = path.join(dir, "same");
    fs.writeFileSync(big, "12345");
    fs.writeFileSync(small, "12");
    fs.writeFileSync(same, "12345");
    expect(await compare(compareFileSizes, big, small)).toBe(1);
    expect(await compare(compareFileSizes, small, big)).toBe(-1);
    expect(await compare(compareFileSizes, big, same)).toBe(0);
  });
});
