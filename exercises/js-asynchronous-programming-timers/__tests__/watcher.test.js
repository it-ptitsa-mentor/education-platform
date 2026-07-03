import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

const loadFunction = async () => {
  const mod = await import("../watcher.js");
  const fn = mod.default ?? mod.watch;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию watch (export default)");
  }
  return fn;
};

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

describe("js-asynchronous-programming-timers", () => {
  it("вызывает колбек при изменении файла", async () => {
    const watch = await loadFunction();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "watcher-"));
    const filepath = path.join(dir, "watched");
    fs.writeFileSync(filepath, "init");
    const callback = vi.fn();
    const id = watch(filepath, 20, callback);
    try {
      await sleep(60);
      expect(callback).not.toHaveBeenCalled();
      fs.appendFileSync(filepath, "ehu");
      await vi.waitFor(() => {
        expect(callback).toHaveBeenCalled();
      }, { timeout: 2000 });
      expect(callback.mock.calls[0][0]).toBeFalsy();
    } finally {
      clearInterval(id);
    }
  });

  it("вызывает колбек с ошибкой, если файла нет", async () => {
    const watch = await loadFunction();
    const callback = vi.fn();
    const id = watch("/nonexistent/path/file", 20, callback);
    try {
      await vi.waitFor(() => {
        expect(callback).toHaveBeenCalled();
      }, { timeout: 2000 });
      expect(callback.mock.calls[0][0]).toBeTruthy();
    } finally {
      clearInterval(id);
    }
  });
});
