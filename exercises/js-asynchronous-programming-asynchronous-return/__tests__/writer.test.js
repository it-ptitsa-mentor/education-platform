import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../writer.js");
  const fn = mod.default ?? mod.write;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию write (export default)");
  }
  return fn;
};

describe("js-asynchronous-programming-asynchronous-return", () => {
  it("записывает данные и вызывает колбек", async () => {
    const write = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "writer-"));
    const filepath = path.join(dir, "myfile");
    await new Promise((resolve, reject) => {
      write(filepath, "data", (err) => (err ? reject(err) : resolve()));
    });
    expect(fs.readFileSync(filepath, "utf-8")).toBe("data");
  });
});
