// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dirname, "..", "index.html"), "utf-8");

const getCounter = (selector) => document.querySelector(`${selector} .btn-info`);

describe("js-frontend-architecture-initialization", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("index.js создает два независимых счётчика", async () => {
    vi.resetModules();
    await import("../src/index.js");
    await vi.waitFor(() => {
      expect(getCounter(".container-1")).not.toBeNull();
      expect(getCounter(".container-2")).not.toBeNull();
    });
    expect(getCounter(".container-1").textContent).toBe("0 clicks");
    getCounter(".container-1").click();
    getCounter(".container-1").click();
    expect(getCounter(".container-1").textContent).toBe("2 clicks");
    expect(getCounter(".container-2").textContent).toBe("0 clicks");
  });

  it("переключение языка в одном счётчике не влияет на другой", async () => {
    vi.resetModules();
    await import("../src/index.js");
    await vi.waitFor(() => {
      expect(getCounter(".container-1")).not.toBeNull();
      expect(getCounter(".container-2")).not.toBeNull();
    });
    const ruButton = document.querySelectorAll(".container-1 .btn-group button")[1];
    ruButton.click();
    await vi.waitFor(() => {
      expect(getCounter(".container-1").textContent).toBe("0 кликов");
    });
    expect(getCounter(".container-2").textContent).toBe("0 clicks");
  });

  it("initialState переопределяет значения по умолчанию", async () => {
    vi.resetModules();
    const app = (await import("../src/application.js")).default;
    if (typeof app !== "function") {
      throw new Error("Экспортируйте функцию приложения (export default)");
    }
    await app(document.querySelector(".container-1"), { data: { clicksCount: 5 } });
    expect(getCounter(".container-1").textContent).toBe("5 clicks");
    await app(document.querySelector(".container-2"), { language: { lng: "ru" } });
    expect(getCounter(".container-2").textContent).toBe("0 кликов");
  });
});
