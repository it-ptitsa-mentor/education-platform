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

describe("js-frontend-architecture-mvc", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("переключает активный таб и контент", async () => {
    const app = await loadApp();
    app();
    document.querySelector("#list-profile-list").click();
    expect(document.querySelector("#list-profile-list").classList.contains("active")).toBe(true);
    expect(document.querySelector("#list-home-list").classList.contains("active")).toBe(false);
    const profilePane = document.querySelector("#list-profile");
    const homePane = document.querySelector("#list-home");
    expect(profilePane.classList.contains("active")).toBe(true);
    expect(profilePane.classList.contains("show")).toBe(true);
    expect(homePane.classList.contains("active")).toBe(false);
    expect(homePane.classList.contains("show")).toBe(false);
  });

  it("компоненты list-group независимы", async () => {
    const app = await loadApp();
    app();
    document.querySelector("#list-profile-list").click();
    expect(document.querySelector("#second-a-list").classList.contains("active")).toBe(true);
    expect(document.querySelector("#second-a").classList.contains("active")).toBe(true);
    document.querySelector("#second-b-list").click();
    expect(document.querySelector("#second-b").classList.contains("active")).toBe(true);
    expect(document.querySelector("#list-profile").classList.contains("active")).toBe(true);
  });
});
