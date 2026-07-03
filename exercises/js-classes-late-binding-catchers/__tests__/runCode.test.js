import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const runCode = (await import("../runCode.js")).default;
  const catchers = await import("../catchers.js");
  const AppNetworkError = (await import("../errors/AppNetworkError.js")).default;
  const NetworkError = (await import("../errors/NetworkError.js")).default;
  if (typeof runCode !== "function") {
    throw new Error("Экспортируйте функцию runCode (export default)");
  }
  return { runCode, ...catchers, AppNetworkError, NetworkError };
};

const errorHandler = (err) => `handled: "${err.message}"`;

describe("js-classes-late-binding-catchers", () => {
  it("runCode возвращает результат экшена и пробрасывает ошибку без кетчера", async () => {
    const { runCode } = await loadAll();
    expect(runCode(() => "Hello, Hexlet!")).toBe("Hello, Hexlet!");
    expect(() => runCode(() => {
      throw new Error("boom");
    })).toThrow("boom");
  });

  it("appErrorCatcher ловит только ошибки приложения нужного типа", async () => {
    const { runCode, appErrorCatcher, AppNetworkError, NetworkError } = await loadAll();
    const failedAction = () => {
      throw new AppNetworkError("Hexlet is unavailable!");
    };
    const catcher1 = appErrorCatcher(errorHandler, AppNetworkError);
    expect(runCode(failedAction, catcher1)).toBe('handled: "Hexlet is unavailable!"');

    const catcher2 = appErrorCatcher(errorHandler, NetworkError);
    expect(() => runCode(failedAction, catcher2)).toThrow("Hexlet is unavailable!");
  });

  it("anyErrorCatcher проверяет только наследование", async () => {
    const { runCode, anyErrorCatcher, AppNetworkError, NetworkError } = await loadAll();
    const failedAction = () => {
      throw new AppNetworkError("boom");
    };
    expect(runCode(failedAction, anyErrorCatcher(errorHandler, Error)))
      .toBe('handled: "boom"');
    expect(() => runCode(failedAction, anyErrorCatcher(errorHandler, NetworkError)))
      .toThrow("boom");
  });

  it("customErrorCatcher ловит ошибки с isCustomError без errorInstance", async () => {
    const { runCode, customErrorCatcher } = await loadAll();
    const failedAction = () => {
      throw Object.assign(new Error("custom boom"), { isCustomError: true });
    };
    expect(runCode(failedAction, customErrorCatcher(errorHandler)))
      .toBe('handled: "custom boom"');
    expect(() => runCode(failedAction, customErrorCatcher(errorHandler, Error)))
      .toThrow("custom boom");

    const plainAction = () => {
      throw new Error("plain boom");
    };
    expect(() => runCode(plainAction, customErrorCatcher(errorHandler)))
      .toThrow("plain boom");
  });
});
