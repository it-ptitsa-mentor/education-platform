import { describe, expect, it } from "vitest";

const makeNode = (className, children = []) => ({
  name: "div",
  type: "tag-internal",
  className,
  children,
});

const loadFunction = async () => {
  const mod = await import("../changeClass.js");
  const fn = mod.default ?? mod.changeClass;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию changeClass (export default)");
  }
  return fn;
};

describe("js-trees-html", () => {
  it("заменяет имя класса во всех узлах", async () => {
    const changeClass = await loadFunction();
    const tree = makeNode("hexlet-community", [
      makeNode("old-class"),
      makeNode("old-class"),
    ]);
    expect(changeClass(tree, "old-class", "new-class")).toEqual(
      makeNode("hexlet-community", [
        makeNode("new-class"),
        makeNode("new-class"),
      ]),
    );
  });

  it("заменяет класс в глубоко вложенных узлах и в корне", async () => {
    const changeClass = await loadFunction();
    const tree = makeNode("old-class", [
      makeNode("other", [makeNode("old-class")]),
    ]);
    expect(changeClass(tree, "old-class", "new-class")).toEqual(
      makeNode("new-class", [
        makeNode("other", [makeNode("new-class")]),
      ]),
    );
  });

  it("не мутирует исходное дерево", async () => {
    const changeClass = await loadFunction();
    const tree = makeNode("root", [makeNode("old-class")]);
    changeClass(tree, "old-class", "new-class");
    expect(tree).toEqual(makeNode("root", [makeNode("old-class")]));
  });
});
