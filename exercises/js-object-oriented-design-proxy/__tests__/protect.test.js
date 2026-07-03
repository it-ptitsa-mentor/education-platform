import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../protect.js");
  const fn = mod.default ?? mod.protect;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию protect (export default)");
  }
  return fn;
};

const makeUser = () => ({ name: "John", age: 25, password: "secret" });

describe("js-object-oriented-design-proxy", () => {
  it("незащищённые поля доступны на чтение и запись", async () => {
    const protect = await loadFunction();
    const protectedUser = protect(makeUser(), ["password"]);
    expect(protectedUser.name).toBe("John");
    expect(protectedUser.age).toBe(25);
    protectedUser.name = "Jane";
    expect(protectedUser.name).toBe("Jane");
  });

  it("чтение и запись защищённых полей бросают исключение", async () => {
    const protect = await loadFunction();
    const protectedUser = protect(makeUser(), ["password"]);
    expect(() => protectedUser.password).toThrow();
    expect(() => {
      protectedUser.password = "newPassword";
    }).toThrow();
  });

  it("поддерживает несколько защищённых полей", async () => {
    const protect = await loadFunction();
    const protectedUser = protect(makeUser(), ["password", "age"]);
    expect(() => protectedUser.age).toThrow();
    expect(protectedUser.name).toBe("John");
  });
});
