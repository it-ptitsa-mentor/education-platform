import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../arrays.js");
  const fn = mod.fillWithFirst ?? mod.default;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию fillWithFirst");
  }
  return fn;
};

describe("js-arrays-references", () => {
  it("заменяет все элементы на первый, мутируя массив", async () => {
    const fillWithFirst = await loadFunction();
    const numbers = [5, 2, 9, 7];
    fillWithFirst(numbers);
    expect(numbers).toEqual([5, 5, 5, 5]);

    const words = ["hello", "world", "js"];
    fillWithFirst(words);
    expect(words).toEqual(["hello", "hello", "hello"]);
  });

  it("не трогает массивы из 0–1 элементов", async () => {
    const fillWithFirst = await loadFunction();
    const single = [10];
    fillWithFirst(single);
    expect(single).toEqual([10]);

    const empty = [];
    fillWithFirst(empty);
    expect(empty).toEqual([]);
  });
});
