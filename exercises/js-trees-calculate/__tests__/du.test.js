import { describe, expect, it } from "vitest";

const mkfile = (name, meta = {}) => ({ name, meta, type: "file" });
const mkdir = (name, children = [], meta = {}) => ({ name, children, meta, type: "directory" });

const loadFunction = async () => {
  const mod = await import("../du.js");
  const fn = mod.default ?? mod.du;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию du (export default)");
  }
  return fn;
};

describe("js-trees-calculate", () => {
  it("считает размеры узлов первого уровня с сортировкой по убыванию", async () => {
    const du = await loadFunction();
    const tree = mkdir("/", [
      mkdir("etc", [
        mkdir("apache"),
        mkdir("nginx", [mkfile("nginx.conf", { size: 800 })]),
        mkdir("consul", [
          mkfile("config.json", { size: 1200 }),
          mkfile("data", { size: 8200 }),
          mkfile("raft", { size: 80 }),
        ]),
      ]),
      mkfile("hosts", { size: 3500 }),
      mkfile("resolve", { size: 1000 }),
    ]);
    expect(du(tree)).toEqual([
      ["etc", 10280],
      ["hosts", 3500],
      ["resolve", 1000],
    ]);
  });

  it("пустая директория имеет нулевой размер", async () => {
    const du = await loadFunction();
    const tree = mkdir("/", [mkdir("empty"), mkfile("file", { size: 10 })]);
    expect(du(tree)).toEqual([
      ["file", 10],
      ["empty", 0],
    ]);
  });
});
