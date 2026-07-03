// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

const getContainer = (field) => document.querySelector(`[data-editable-target="${field}"]`);

const saveValue = (field, value) => {
  const container = getContainer(field);
  const input = container.querySelector('input[type="text"]');
  input.value = value;
  container.querySelector("form").dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true }),
  );
};

describe("js-frontend-architecture-processes", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("клик открывает форму с кнопкой Save <field>", async () => {
    const app = await loadApp();
    app();
    getContainer("name").click();
    const container = getContainer("name");
    expect(container.querySelector("form")).not.toBeNull();
    expect(container.querySelector('input[type="submit"]').value).toBe("Save name");
    expect(container.querySelector('input[type="text"]').value).toBe("");
  });

  it("сохранение показывает значение, повторный клик открывает форму с ним", async () => {
    const app = await loadApp();
    app();
    getContainer("name").click();
    saveValue("name", "Cat");
    expect(getContainer("name").textContent).toBe("Cat");
    expect(getContainer("name").querySelector("form")).toBeNull();
    getContainer("name").click();
    expect(getContainer("name").querySelector('input[type="text"]').value).toBe("Cat");
  });

  it("поля независимы", async () => {
    const app = await loadApp();
    app();
    getContainer("email").click();
    expect(getContainer("email").querySelector('input[type="submit"]').value).toBe("Save email");
    saveValue("email", "cat@dog.com");
    expect(getContainer("email").textContent).toBe("cat@dog.com");
    expect(getContainer("name").querySelector("i").textContent).toBe("name");
  });
});
