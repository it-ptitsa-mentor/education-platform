// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dirname, "..", "public", "index.html"), "utf-8");

const loadApp = async () => {
  vi.resetModules();
  const mod = await import("../src/application.js");
  if (typeof mod.default !== "function") {
    throw new Error("Экспортируйте функцию приложения (export default)");
  }
  return mod.default;
};

const submitForm = (container, value) => {
  const form = document.querySelector(`[data-container="${container}"]`);
  form.elements.name.value = value;
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
};

const getTasks = () => [...document.querySelectorAll('[data-container="tasks"] li')]
  .map((li) => li.textContent);

const getListsHtml = () => document.querySelector('[data-container="lists"]');

describe("js-frontend-architecture-shape-of-state", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("по умолчанию создан активный список General без задач", async () => {
    const app = await loadApp();
    app();
    expect(getListsHtml().querySelector("li b").textContent).toBe("General");
    expect(document.querySelector('[data-container="tasks"] ul')).toBeNull();
  });

  it("добавляет задачи в активный список", async () => {
    const app = await loadApp();
    app();
    submitForm("new-task-form", "first task");
    expect(getTasks()).toEqual(["first task"]);
    submitForm("new-task-form", "second task");
    expect(getTasks()).toEqual(["first task", "second task"]);
  });

  it("новые списки добавляются ссылками, задачи привязаны к спискам", async () => {
    const app = await loadApp();
    app();
    submitForm("new-task-form", "general task");
    submitForm("new-list-form", "Work");
    const workLink = [...getListsHtml().querySelectorAll("a")]
      .find((a) => a.textContent === "Work");
    expect(workLink).toBeDefined();

    workLink.click();
    expect(getListsHtml().querySelector("li b").textContent).toBe("Work");
    expect(document.querySelector('[data-container="tasks"] ul')).toBeNull();

    submitForm("new-task-form", "work task");
    expect(getTasks()).toEqual(["work task"]);

    const generalLink = [...getListsHtml().querySelectorAll("a")]
      .find((a) => a.textContent === "General");
    generalLink.click();
    expect(getTasks()).toEqual(["general task"]);
  });
});
