import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../html.js");
  const fn = mod.default ?? mod.stringify;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию stringify (export default)");
  }
  return fn;
};

describe("js-polymorphism-dispatch-functions-by-key", () => {
  it("одиночные теги", async () => {
    const stringify = await loadFunction();
    expect(stringify({
      name: "hr",
      class: "px-3",
      id: "myid",
      tagType: "single",
    })).toBe('<hr class="px-3" id="myid">');
  });

  it("парные теги с телом и без", async () => {
    const stringify = await loadFunction();
    expect(stringify({
      name: "div",
      tagType: "pair",
      body: "text2",
      id: "wow",
    })).toBe('<div id="wow">text2</div>');

    expect(stringify({
      name: "div",
      tagType: "pair",
      body: "",
      id: "empty",
    })).toBe('<div id="empty"></div>');

    expect(stringify({
      name: "div",
      tagType: "pair",
      body: "",
      id: "withAttr",
      someAttr: "value",
    })).toBe('<div id="withAttr" someAttr="value"></div>');
  });
});
