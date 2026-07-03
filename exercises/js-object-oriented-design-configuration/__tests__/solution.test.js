import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../solution.js");
  const PasswordValidator = mod.default ?? mod.PasswordValidator;
  if (typeof PasswordValidator !== "function") {
    throw new Error("Экспортируйте класс PasswordValidator (export default)");
  }
  return PasswordValidator;
};

describe("js-object-oriented-design-configuration", () => {
  it("опции по умолчанию: minLength 8 и containNumbers true", async () => {
    const PasswordValidator = await loadClass();
    const validator = new PasswordValidator();
    expect(validator.validate("qwerty12")).toEqual({});
    expect(validator.validate("qwerty1")).toEqual({ minLength: "too small" });
    expect(validator.validate("qwertyui")).toEqual({
      containNumbers: "should contain at least one number",
    });
  });

  it("опции переопределяются через конструктор", async () => {
    const PasswordValidator = await loadClass();
    const validator = new PasswordValidator({ containNumbers: false });
    expect(validator.validate("qwertyui")).toEqual({});
    expect(validator.validate("qwerty")).toEqual({ minLength: "too small" });

    const strict = new PasswordValidator({ minLength: 3 });
    expect(strict.validate("ab1")).toEqual({});
  });

  it("может вернуть несколько ошибок сразу", async () => {
    const PasswordValidator = await loadClass();
    const validator = new PasswordValidator();
    expect(validator.validate("qwe")).toEqual({
      minLength: "too small",
      containNumbers: "should contain at least one number",
    });
  });
});
