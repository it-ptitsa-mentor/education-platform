import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../file.js");
  const fn = mod.move ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию move");
  }
  return fn;
};

const moveAsync = (fn, src, dest) => new Promise((resolve) => {
  fn(src, dest, resolve);
});

describe("js-asynchronous-programming-error-handling", () => {
  it("перемещает файл", async () => {
    const move = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "move-"));
    const src = path.join(dir, "src.txt");
    const dest = path.join(dir, "dest.txt");
    fs.writeFileSync(src, "content");
    const error = await moveAsync(move, src, dest);
    expect(error).toBeFalsy();
    expect(fs.readFileSync(dest, "utf-8")).toBe("content");
    expect(fs.existsSync(src)).toBe(false);
  });

  it("передаёт ошибку в колбек, если исходника нет", async () => {
    const move = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "move-"));
    const error = await moveAsync(
      move,
      path.join(dir, "nonexistent"),
      path.join(dir, "dest.txt"),
    );
    expect(error).toBeTruthy();
  });
});
