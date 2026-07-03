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

const getCounter = () => document.querySelector(".btn-info");
const getReset = () => document.querySelector(".btn-warning");
const getLangButtons = () => document.querySelectorAll(".btn-group button");

describe("js-frontend-architecture-i18n", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("начальное состояние — английский, 0 clicks", async () => {
    const app = await loadApp();
    await app();
    expect(getCounter().textContent).toBe("0 clicks");
    expect(getReset().textContent).toBe("Reset");
  });

  it("счётчик и множественные формы на русском", async () => {
    const app = await loadApp();
    await app();
    getCounter().click();
    getCounter().click();
    expect(getCounter().textContent).toBe("2 clicks");
    const [enButton, ruButton] = getLangButtons();
    ruButton.click();
    await vi.waitFor(() => {
      expect(getCounter().textContent).toBe("2 клика");
    });
    expect(getReset().textContent).toBe("Сбросить");
    expect(ruButton.classList.contains("btn-primary")).toBe(true);
    expect(enButton.classList.contains("btn-outline-primary")).toBe(true);
  });

  it("одна форма и сброс на русском", async () => {
    const app = await loadApp();
    await app();
    const [, ruButton] = getLangButtons();
    getCounter().click();
    ruButton.click();
    await vi.waitFor(() => {
      expect(getCounter().textContent).toBe("1 клик");
    });
    getReset().click();
    expect(getCounter().textContent).toBe("0 кликов");
  });
});
