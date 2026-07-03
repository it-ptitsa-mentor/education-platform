import { describe, expect, it } from "vitest";

const loadFunction = async () => {
  const mod = await import("../generator.js");
  const fn = mod.default ?? mod.generate;
  if (typeof fn !== "function") {
    throw new Error("Экспортируйте функцию по умолчанию (export default)");
  }
  return fn;
};

describe("js-trees-filesystem", () => {
  it("создает файловую систему из условия", async () => {
    const generate = await loadFunction();
    expect(generate()).toEqual({
      name: "nodejs-package",
      type: "directory",
      meta: { hidden: true },
      children: [
        { name: "Makefile", type: "file", meta: {} },
        { name: "README.md", type: "file", meta: {} },
        { name: "dist", type: "directory", meta: {}, children: [] },
        {
          name: "__tests__",
          type: "directory",
          meta: {},
          children: [
            { name: "half.test.js", type: "file", meta: { type: "text/javascript" } },
          ],
        },
        { name: "babel.config.js", type: "file", meta: { type: "text/javascript" } },
        {
          name: "node_modules",
          type: "directory",
          meta: { owner: "root", hidden: false },
          children: [
            {
              name: "@babel",
              type: "directory",
              meta: {},
              children: [
                {
                  name: "cli",
                  type: "directory",
                  meta: {},
                  children: [{ name: "LICENSE", type: "file", meta: {} }],
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
