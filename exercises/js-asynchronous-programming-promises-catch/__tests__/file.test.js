import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../file.js");
  const fn = mod.touch ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию touch");
  }
  return fn;
};

describe("js-asynchronous-programming-promises-catch", () => {
  it("создаёт файл, если его нет", async () => {
    const touch = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "touch-"));
    const filepath = path.join(dir, "myfile");
    await touch(filepath);
    expect(fs.existsSync(filepath)).toBe(true);
  });

  it("не трогает существующий файл и завершается успешно", async () => {
    const touch = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "touch-"));
    const filepath = path.join(dir, "myfile");
    fs.writeFileSync(filepath, "content");
    await expect(touch(filepath)).resolves.not.toThrow();
    expect(fs.readFileSync(filepath, "utf-8")).toBe("content");
  });
});
