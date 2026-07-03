import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../file.js");
  const fn = mod.exchange ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию exchange");
  }
  return fn;
};

describe("js-asynchronous-programming-async-await", () => {
  it("обменивает содержимое двух файлов", async () => {
    const exchange = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "exchange-"));
    const file1 = path.join(dir, "myfile1");
    const file2 = path.join(dir, "myfile2");
    fs.writeFileSync(file1, "first");
    fs.writeFileSync(file2, "second");
    await exchange(file1, file2);
    expect(fs.readFileSync(file1, "utf-8")).toBe("second");
    expect(fs.readFileSync(file2, "utf-8")).toBe("first");
  });
});
