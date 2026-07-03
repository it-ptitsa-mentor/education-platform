import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const InputTag = (await import("../tags/InputTag.js")).default;
  const mod = await import("../tags/LabelTag.js");
  const LabelTag = mod.default ?? mod.LabelTag;
  if (typeof LabelTag !== "function") {
    throw new Error("Экспортируйте класс LabelTag (export default)");
  }
  return { InputTag, LabelTag };
};

describe("js-polymorphism-patterns", () => {
  it("оборачивает тег в label", async () => {
    const { InputTag, LabelTag } = await loadAll();
    const inputTag = new InputTag("submit", "Save");
    const labelTag = new LabelTag("Press Submit", inputTag);
    expect(labelTag.render()).toBe(
      '<label>Press Submit<input type="submit" value="Save"></label>',
    );
  });

  it("умеет оборачивать label в label (композиция)", async () => {
    const { InputTag, LabelTag } = await loadAll();
    const inner = new LabelTag("Email", new InputTag("email", ""));
    const outer = new LabelTag("Form: ", inner);
    expect(outer.render()).toBe(
      '<label>Form: <label>Email<input type="email" value=""></label></label>',
    );
  });
});
