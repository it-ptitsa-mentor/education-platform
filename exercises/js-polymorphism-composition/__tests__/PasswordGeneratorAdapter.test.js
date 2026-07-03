import crypto from "node:crypto";
import { describe, expect, it } from "vitest";

const sha1 = (value) => crypto.createHash("sha1").update(value).digest("hex");

const loadBuilder = async () => {
  const PasswordBuilder = (await import("../PasswordBuilder.js")).default;
  const mod = await import("../PasswordGeneratorAdapter.js");
  const PasswordGeneratorAdapter = mod.default ?? mod.PasswordGeneratorAdapter;
  if (typeof PasswordGeneratorAdapter !== "function") {
    throw new Error("Экспортируйте класс PasswordGeneratorAdapter (export default)");
  }
  return new PasswordBuilder(new PasswordGeneratorAdapter());
};

describe("js-polymorphism-composition", () => {
  it("генерирует пароль нужной длины только из строчных букв без опций", async () => {
    const builder = await loadBuilder();
    const { password, digest } = builder.buildPassword(10, []);
    expect(password).toMatch(/^[a-z]{10}$/);
    expect(digest).toBe(sha1(password));
  });

  it("учитывает опции uppercase, numbers и symbols", async () => {
    const builder = await loadBuilder();
    const { password, digest } = builder.buildPassword(30, [
      "uppercase",
      "numbers",
      "symbols",
    ]);
    expect(password).toHaveLength(30);
    expect(password).not.toMatch(/^[a-z]+$/);
    expect(digest).toBe(sha1(password));
  });
});
