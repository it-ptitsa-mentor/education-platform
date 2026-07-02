import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../strings.js");
  const fn = mod.default ?? mod.makeCensored;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-arrays-strings", () => {
  it("заменяет стоп-слова на $#%!", async () => {
    const makeCensored = await loadFunction();
    expect(
      makeCensored(
        "When you play the game of thrones, you win or you die",
        ["die", "play"],
      ),
    ).toBe("When you $#%! the game of thrones, you win or you $#%!");
  });

  it("слово — точная последовательность символов, включая знаки", async () => {
    const makeCensored = await loadFunction();
    expect(
      makeCensored("chicken chicken? chicken! chicken", ["?", "chicken"]),
    ).toBe("$#%! chicken? chicken! $#%!");
  });

  it("возвращает текст без изменений при пустом списке стоп-слов", async () => {
    const makeCensored = await loadFunction();
    expect(makeCensored("hello world", [])).toBe("hello world");
  });
});
