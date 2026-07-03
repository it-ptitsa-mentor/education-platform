// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dirname, "..", "index.html"), "utf-8");

const loadAll = async () => {
  vi.resetModules();
  const laptops = (await import("../src/index.js")).default;
  const app = (await import("../src/application.js")).default;
  if (typeof app !== "function") {
    throw new Error("Экспортируйте функцию приложения (export default)");
  }
  return { app, laptops };
};

const getModels = () => [...document.querySelectorAll(".result li")]
  .map((li) => li.textContent);

const setSelect = (name, value) => {
  const el = document.querySelector(`[name=${name}]`);
  el.value = value;
  el.dispatchEvent(new Event("change", { bubbles: true }));
};

const setInput = (name, value) => {
  const el = document.querySelector(`[name=${name}]`);
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
};

describe("js-frontend-architecture-rendering", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("на старте выводится весь список", async () => {
    const { app, laptops } = await loadAll();
    app(laptops);
    expect(getModels()).toEqual(["v1", "v2", "p1", "p2"]);
  });

  it("фильтрует по процессору и частоте", async () => {
    const { app, laptops } = await loadAll();
    app(laptops);
    setSelect("processor_eq", "intel");
    expect(getModels()).toEqual(["v1", "v2"]);
    setInput("frequency_gte", "3");
    expect(getModels()).toEqual(["v2"]);
  });

  it("если ничего не подходит — список не выводится", async () => {
    const { app, laptops } = await loadAll();
    app(laptops);
    setSelect("memory_eq", "8");
    setInput("frequency_gte", "3");
    expect(document.querySelector(".result ul")).toBeNull();
  });

  it("сброс фильтра возвращает элементы", async () => {
    const { app, laptops } = await loadAll();
    app(laptops);
    setSelect("processor_eq", "amd");
    expect(getModels()).toEqual(["p1", "p2"]);
    setSelect("processor_eq", "");
    expect(getModels()).toEqual(["v1", "v2", "p1", "p2"]);
  });
});
