import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../getHiddenCard.js");
  const fn = mod.default ?? mod.getHiddenCard;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getHiddenCard (export default)");
  }
  return fn;
};

describe("js-basics-functions-default-parameters", () => {
  it("скрывает номер карты указанным количеством звёздочек", async () => {
    const getHiddenCard = await loadFunction();
    expect(getHiddenCard("1234567812345678", 2)).toBe("**5678");
    expect(getHiddenCard("1234567812345678", 3)).toBe("***5678");
    expect(getHiddenCard("2034399002121100", 1)).toBe("*1100");
  });

  it("использует 4 звёздочки по умолчанию", async () => {
    const getHiddenCard = await loadFunction();
    expect(getHiddenCard("1234567812345678")).toBe("****5678");
    expect(getHiddenCard("2034399002125581")).toBe("****5581");
  });
});
