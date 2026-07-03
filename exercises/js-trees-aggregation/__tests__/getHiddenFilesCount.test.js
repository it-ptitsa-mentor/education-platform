import { describe, expect, it } from "vitest";

const mkfile = (name, meta = {}) => ({ name, meta, type: "file" });
const mkdir = (name, children = [], meta = {}) => ({ name, children, meta, type: "directory" });

const loadFunction = async () => {
  const mod = await import("../getHiddenFilesCount.js");
  const fn = mod.default ?? mod.getHiddenFilesCount;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию getHiddenFilesCount (export default)");
  }
  return fn;
};

describe("js-trees-aggregation", () => {
  it("считает скрытые файлы во всех поддиректориях", async () => {
    const getHiddenFilesCount = await loadFunction();
    const tree = mkdir("/", [
      mkdir("etc", [
        mkdir("apache"),
        mkdir("nginx", [mkfile(".nginx.conf", { size: 800 })]),
        mkdir(".consul", [
          mkfile(".config.json", { size: 1200 }),
          mkfile("data", { size: 8200 }),
          mkfile("raft", { size: 80 }),
        ]),
      ]),
      mkfile(".hosts", { size: 3500 }),
      mkfile("resolve", { size: 1000 }),
    ]);
    expect(getHiddenFilesCount(tree)).toBe(3);
  });

  it("возвращает 0, если скрытых файлов нет", async () => {
    const getHiddenFilesCount = await loadFunction();
    expect(getHiddenFilesCount(mkdir("/", [mkfile("hosts")]))).toBe(0);
    expect(getHiddenFilesCount(mkdir("/"))).toBe(0);
  });
});
