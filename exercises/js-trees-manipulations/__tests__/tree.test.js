import { describe, expect, it } from "vitest";

const mkfile = (name, meta = {}) => ({ name, meta, type: "file" });
const mkdir = (name, children = [], meta = {}) => ({ name, children, meta, type: "directory" });

const loadFunction = async () => {
  const mod = await import("../tree.js");
  const fn = mod.default ?? mod.compressImages;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию compressImages()");
  }
  return fn;
};

describe("js-trees-manipulations", () => {
  it("сжимает jpg-картинки текущей директории в два раза", async () => {
    const compressImages = await loadFunction();
    const tree = mkdir("my documents", [
      mkfile("avatar.jpg", { size: 100 }),
      mkfile("passport.jpg", { size: 200 }),
      mkfile("family.jpg", { size: 150 }),
      mkfile("addresses", { size: 125 }),
      mkdir("presentations"),
    ]);
    expect(compressImages(tree)).toEqual(
      mkdir("my documents", [
        mkfile("avatar.jpg", { size: 50 }),
        mkfile("passport.jpg", { size: 100 }),
        mkfile("family.jpg", { size: 75 }),
        mkfile("addresses", { size: 125 }),
        mkdir("presentations"),
      ]),
    );
  });

  it("не заходит во вложенные директории и не мутирует исходное дерево", async () => {
    const compressImages = await loadFunction();
    const tree = mkdir("root", [
      mkdir("nested", [mkfile("photo.jpg", { size: 100 })]),
      mkfile("pic.jpg", { size: 40 }),
    ]);
    const result = compressImages(tree);
    expect(result).toEqual(
      mkdir("root", [
        mkdir("nested", [mkfile("photo.jpg", { size: 100 })]),
        mkfile("pic.jpg", { size: 20 }),
      ]),
    );
    expect(tree).toEqual(
      mkdir("root", [
        mkdir("nested", [mkfile("photo.jpg", { size: 100 })]),
        mkfile("pic.jpg", { size: 40 }),
      ]),
    );
  });
});
