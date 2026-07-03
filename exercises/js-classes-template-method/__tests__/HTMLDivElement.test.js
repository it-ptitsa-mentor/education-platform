import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const HTMLPairElement = (await import("../HTMLPairElement.js")).default;
  const HTMLDivElement = (await import("../HTMLDivElement.js")).default;
  if (typeof HTMLPairElement !== "function") {
    throw new Error("Экспортируйте класс HTMLPairElement (export default)");
  }
  if (typeof HTMLDivElement !== "function") {
    throw new Error("Экспортируйте класс HTMLDivElement (export default)");
  }
  return { HTMLPairElement, HTMLDivElement };
};

describe("js-classes-template-method", () => {
  it("div с атрибутами и телом", async () => {
    const { HTMLDivElement } = await loadAll();
    const div = new HTMLDivElement({ name: "div", "data-toggle": true });
    div.setTextContent("Body");
    expect(div.toString()).toBe('<div name="div" data-toggle="true">Body</div>');
    expect(div.getTextContent()).toBe("Body");
  });

  it("div без атрибутов и тела", async () => {
    const { HTMLDivElement } = await loadAll();
    const div = new HTMLDivElement();
    expect(div.toString()).toBe("<div></div>");
    expect(div.getTextContent()).toBe("");
  });

  it("HTMLDivElement наследуется от HTMLPairElement", async () => {
    const { HTMLPairElement, HTMLDivElement } = await loadAll();
    expect(new HTMLDivElement()).toBeInstanceOf(HTMLPairElement);
  });
});
