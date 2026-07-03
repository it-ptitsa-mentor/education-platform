// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dirname, "..", "index.html"), "utf-8");

const companies = [
  { name: "Hexlet", description: "programming courses" },
  { name: "Google", description: "search engine" },
  { name: "Facebook", description: "social network" },
];

const loadApp = async () => {
  vi.resetModules();
  const mod = await import("../src/application.js");
  if (typeof mod.default !== "function") {
    throw new Error("Экспортируйте функцию приложения (export default)");
  }
  return mod.default;
};

const getDescription = () => document.querySelector(".container div");

describe("js-frontend-architecture-ui-state", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("рендерит по кнопке на компанию, описаний нет", async () => {
    const app = await loadApp();
    app(companies);
    const buttons = document.querySelectorAll(".container button");
    expect([...buttons].map((b) => b.textContent.trim())).toEqual([
      "Hexlet", "Google", "Facebook",
    ]);
    expect(getDescription()).toBeNull();
  });

  it("клик показывает описание, другой клик заменяет, повторный удаляет", async () => {
    const app = await loadApp();
    app(companies);
    const buttons = document.querySelectorAll(".container button");
    buttons[1].click();
    expect(getDescription().textContent).toBe("search engine");
    buttons[2].click();
    expect(getDescription().textContent).toBe("social network");
    expect(document.querySelectorAll(".container div")).toHaveLength(1);
    buttons[2].click();
    expect(getDescription()).toBeNull();
  });
});
