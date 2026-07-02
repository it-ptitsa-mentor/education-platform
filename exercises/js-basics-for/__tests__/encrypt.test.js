import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../encrypt.js");
  const fn = mod.default ?? mod.encrypt;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию encrypt (export default)");
  }
  return fn;
};

describe("js-basics-for", () => {
  it("меняет местами каждые два символа", async () => {
    const encrypt = await loadFunction();
    expect(encrypt("move")).toBe("omev");
    expect(encrypt("attack")).toBe("taatkc");
    expect(encrypt("car!")).toBe("ac!r");
  });

  it("оставляет последний символ на месте при нечётной длине", async () => {
    const encrypt = await loadFunction();
    expect(encrypt("go!")).toBe("og!");
  });

  it("работает с пустой строкой и одним символом", async () => {
    const encrypt = await loadFunction();
    expect(encrypt("")).toBe("");
    expect(encrypt("a")).toBe("a");
  });
});
