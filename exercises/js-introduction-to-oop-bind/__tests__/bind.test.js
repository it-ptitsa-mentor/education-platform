import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../bind.js");
  const fn = mod.default ?? mod.bind;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию bind (export default)");
  }
  return fn;
};

describe("js-introduction-to-oop-bind", () => {
  it("привязывает функцию к контексту", async () => {
    const bind = await loadFunction();
    const obj = { number: 5 };
    const fn = function fn(number) {
      return number + this.number;
    };
    const fnWithContext = bind(obj, fn);
    expect(fnWithContext(3)).toBe(8);
  });

  it("передает все аргументы", async () => {
    const bind = await loadFunction();
    const obj = { prefix: ">" };
    const fn = function fn(...parts) {
      return `${this.prefix} ${parts.join(" ")}`;
    };
    const fnWithContext = bind(obj, fn);
    expect(fnWithContext("a", "b", "c")).toBe("> a b c");
    expect(fnWithContext()).toBe("> ");
  });
});
