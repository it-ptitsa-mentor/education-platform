import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const HTMLElement = (await import("../HTMLElement.js")).default;
  const HTMLHrElement = (await import("../HTMLHrElement.js")).default;
  if (typeof HTMLHrElement !== "function") {
    throw new Error("Экспортируйте класс HTMLHrElement (export default)");
  }
  return { HTMLElement, HTMLHrElement };
};

describe("js-classes-inheritance", () => {
  it("hr без атрибутов", async () => {
    const { HTMLHrElement } = await loadAll();
    expect(new HTMLHrElement().toString()).toBe("<hr>");
  });

  it("hr с атрибутами", async () => {
    const { HTMLHrElement } = await loadAll();
    const hr = new HTMLHrElement({ class: "w-75", id: "wop" });
    expect(hr.toString()).toBe('<hr class="w-75" id="wop">');
  });

  it("HTMLHrElement наследуется от HTMLElement", async () => {
    const { HTMLElement, HTMLHrElement } = await loadAll();
    expect(new HTMLHrElement()).toBeInstanceOf(HTMLElement);
  });
});
