import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../solution.js");
  const fn = mod.default ?? mod.mySubstr;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию mySubstr (export default)");
  }
  return fn;
};

describe("js-basics-iteration-over-strings", () => {
  it("извлекает подстроку указанной длины с начала строки", async () => {
    const mySubstr = await loadFunction();
    const text = "If I look back I am lost";
    expect(mySubstr(text, 1)).toBe("I");
    expect(mySubstr(text, 7)).toBe("If I lo");
  });

  it("возвращает всю строку при длине равной строке", async () => {
    const mySubstr = await loadFunction();
    expect(mySubstr("abc", 3)).toBe("abc");
  });
});
