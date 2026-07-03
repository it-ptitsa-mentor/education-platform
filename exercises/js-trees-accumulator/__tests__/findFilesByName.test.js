import { describe, expect, it } from "vitest";

const mkfile = (name, meta = {}) => ({ name, meta, type: "file" });
const mkdir = (name, children = [], meta = {}) => ({ name, children, meta, type: "directory" });

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

const loadFunction = async () => {
  const mod = await import("../findFilesByName.js");
  const fn = mod.default ?? mod.findFilesByName;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию findFilesByName (export default)");
  }
  return fn;
};

describe("js-trees-accumulator", () => {
  it("находит файлы по подстроке и возвращает полные пути", async () => {
    const findFilesByName = await loadFunction();
    expect(findFilesByName(tree, "co")).toEqual([
      "/etc/nginx/nginx.conf",
      "/etc/consul/config.json",
    ]);
  });

  it("возвращает пустой массив, если совпадений нет", async () => {
    const findFilesByName = await loadFunction();
    expect(findFilesByName(tree, "zzz")).toEqual([]);
  });
});
