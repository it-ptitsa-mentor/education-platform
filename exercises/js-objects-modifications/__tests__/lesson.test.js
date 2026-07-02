import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../lesson.js");
  const fn = mod.default ?? mod.normalize;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-objects-modifications", () => {
  it("нормализует имя и описание, мутируя объект", async () => {
    const normalize = await loadFunction();
    const lesson = {
      name: "ДеструКТУРИЗАЦИЯ",
      description: "каК удивитЬ друзей",
    };
    normalize(lesson);
    expect(lesson).toEqual({
      name: "Деструктуризация",
      description: "как удивить друзей",
    });
  });

  it("не меняет уже нормализованные данные", async () => {
    const normalize = await loadFunction();
    const lesson = { name: "Объекты", description: "просто про объекты" };
    normalize(lesson);
    expect(lesson).toEqual({
      name: "Объекты",
      description: "просто про объекты",
    });
  });
});
