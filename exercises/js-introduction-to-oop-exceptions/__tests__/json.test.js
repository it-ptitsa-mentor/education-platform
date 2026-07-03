import { describe, expect, it } from "vitest";

const loadModule = async () => {
  const mod = await import("../json.js");
  const parseJson = mod.default ?? mod.parseJson;
  if (typeof parseJson !== "function") {
    throw new Error("Экспортируйте функцию parseJson()");
  }
  return { parseJson, ParseError: mod.ParseError };
};

describe("js-introduction-to-oop-exceptions", () => {
  it("парсит корректный json", async () => {
    const { parseJson } = await loadModule();
    expect(parseJson('{ "key": "value" }')).toEqual({ key: "value" });
    expect(parseJson("[1, 2, 3]")).toEqual([1, 2, 3]);
  });

  it("выбрасывает ParseError для некорректного json", async () => {
    const { parseJson, ParseError } = await loadModule();
    expect(() => parseJson('{ key": "value" }')).toThrow(ParseError);
  });
});
