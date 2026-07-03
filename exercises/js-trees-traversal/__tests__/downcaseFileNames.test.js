import { describe, expect, it } from "vitest";

const mkfile = (name, meta = {}) => ({ name, meta, type: "file" });
const mkdir = (name, children = [], meta = {}) => ({ name, children, meta, type: "directory" });

const loadFunction = async () => {
  const mod = await import("../downcaseFileNames.js");
  const fn = mod.default ?? mod.downcaseFileNames;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию downcaseFileNames (export default)");
  }
  return fn;
};

describe("js-trees-traversal", () => {
  it("приводит имена файлов к нижнему регистру, не трогая директории", async () => {
    const downcaseFileNames = await loadFunction();
    const tree = mkdir("/", [
      mkdir("eTc", [
        mkdir("NgiNx"),
        mkdir("CONSUL", [mkfile("CONFIG.json")]),
      ]),
      mkfile("hOsts"),
    ]);
    expect(downcaseFileNames(tree)).toEqual(
      mkdir("/", [
        mkdir("eTc", [
          mkdir("NgiNx"),
          mkdir("CONSUL", [mkfile("config.json")]),
        ]),
        mkfile("hosts"),
      ]),
    );
  });

  it("не мутирует исходное дерево", async () => {
    const downcaseFileNames = await loadFunction();
    const tree = mkdir("/", [mkfile("HOSTS")]);
    downcaseFileNames(tree);
    expect(tree).toEqual(mkdir("/", [mkfile("HOSTS")]));
  });
});
