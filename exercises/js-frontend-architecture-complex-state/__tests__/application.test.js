// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(async () => ({ data: { items: [{ name: "old task" }] } })),
    post: vi.fn(async () => ({ status: 201 })),
  },
}));

const dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dirname, "..", "index.html"), "utf-8");

const loadApp = async () => {
  vi.resetModules();
  const mod = await import("../src/application.js");
  if (typeof mod.default !== "function") {
    throw new Error("Экспортируйте функцию приложения (export default)");
  }
  return mod.default;
};

const getTasks = () => [...document.querySelectorAll("#tasks li")]
  .map((li) => li.textContent);

const addTask = (name) => {
  const input = document.querySelector('input[name="name"]');
  input.value = name;
  document.querySelector("form").dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true }),
  );
};

describe("js-frontend-architecture-complex-state", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("при инициализации загружает задачи с сервера", async () => {
    const axios = (await import("axios")).default;
    const app = await loadApp();
    await app();
    expect(axios.get).toHaveBeenCalled();
    expect(getTasks()).toEqual(["old task"]);
  });

  it("добавляет задачу первой в списке и шлёт её на сервер", async () => {
    const axios = (await import("axios")).default;
    const app = await loadApp();
    await app();
    addTask("Первая задача");
    await vi.waitFor(() => {
      expect(getTasks()).toEqual(["Первая задача", "old task"]);
    });
    addTask("Вторая задача");
    await vi.waitFor(() => {
      expect(getTasks()).toEqual(["Вторая задача", "Первая задача", "old task"]);
    });
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { name: "Вторая задача" });
    expect(document.querySelector('input[name="name"]').value).toBe("");
  });
});
