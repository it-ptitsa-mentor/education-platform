// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(async () => ({ status: 200 })),
    get: vi.fn(async () => ({ data: {} })),
  },
}));

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

const type = (name, value) => {
  const input = document.querySelector(`[name="${name}"]`);
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
};

const getSubmit = () => document.querySelector('input[type="submit"]');

const fillValid = () => {
  type("name", "Vasya");
  type("email", "vasya@example.com");
  type("password", "supersecret");
  type("passwordConfirmation", "supersecret");
};

describe("js-frontend-architecture-forms", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  it("кнопка отправки заблокирована по умолчанию", async () => {
    const app = await loadApp();
    app();
    expect(getSubmit().disabled).toBe(true);
  });

  it("невалидный email подсвечивается с текстом ошибки", async () => {
    const app = await loadApp();
    app();
    type("email", "not-an-email");
    const input = document.querySelector('[name="email"]');
    expect(input.classList.contains("is-invalid")).toBe(true);
    const feedback = input.parentElement.querySelector(".invalid-feedback");
    expect(feedback.textContent).toBe("Value is not a valid email");
    expect(getSubmit().disabled).toBe(true);
  });

  it("короткий пароль подсвечивается", async () => {
    const app = await loadApp();
    app();
    type("password", "123");
    const input = document.querySelector('[name="password"]');
    expect(input.classList.contains("is-invalid")).toBe(true);
    expect(
      input.parentElement.querySelector(".invalid-feedback").textContent,
    ).toBe("Must be at least 6 letters");
  });

  it("валидная форма разблокирует кнопку, отправка показывает User Created!", async () => {
    const axios = (await import("axios")).default;
    const app = await loadApp();
    app();
    fillValid();
    expect(getSubmit().disabled).toBe(false);
    document.querySelector("form").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
    await vi.waitFor(() => {
      expect(document.querySelector('[data-container="sign-up"]').innerHTML)
        .toBe("User Created!");
    });
    expect(axios.post).toHaveBeenCalledWith("/users", expect.objectContaining({
      email: "vasya@example.com",
    }));
  });
});
