import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const loadFunction = async () => {
  const mod = await import("../printer.js");
  const fn = mod.default ?? mod.print;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию print (export default)");
  }
  return fn;
};

describe("js-asynchronous-programming-asynchronous-code", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("печатает содержимое файла", async () => {
    const print = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "printer-"));
    const filepath = path.join(dir, "myfile");
    fs.writeFileSync(filepath, "hello, hexlet");
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    await print(filepath);
    await vi.waitFor(() => {
      expect(spy).toHaveBeenCalledWith("hello, hexlet");
    });
  });
});
