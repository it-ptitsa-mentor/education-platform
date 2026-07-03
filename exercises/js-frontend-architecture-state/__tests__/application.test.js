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
  const app = mod.default;
  if (typeof app !== "function") {
    throw new Error("Экспортируйте функцию приложения (export default)");
  }
  return app;
};

const submitValue = (value) => {
  const input = document.querySelector("input[type=number]");
  input.value = value;
  document.querySelector("form").dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true }),
  );
};

describe("js-frontend-architecture-state", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("изначально сумма равна 0 и фокус на поле ввода", async () => {
    const app = await loadApp();
    app();
    expect(document.querySelector("#result").textContent).toBe("0");
    expect(document.activeElement).toBe(document.querySelector("input[type=number]"));
  });

  it("складывает введённые числа", async () => {
    const app = await loadApp();
    app();
    submitValue("5");
    expect(document.querySelector("#result").textContent).toBe("5");
    submitValue("3");
    expect(document.querySelector("#result").textContent).toBe("8");
  });

  it("очищает форму после отправки и держит фокус", async () => {
    const app = await loadApp();
    app();
    submitValue("7");
    expect(document.querySelector("input[type=number]").value).toBe("");
    expect(document.activeElement).toBe(document.querySelector("input[type=number]"));
  });

  it("кнопка сброса возвращает сумму к нулю", async () => {
    const app = await loadApp();
    app();
    submitValue("5");
    document.querySelector("button").click();
    expect(document.querySelector("#result").textContent).toBe("0");
  });
});
