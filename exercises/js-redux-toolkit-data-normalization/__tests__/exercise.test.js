import { describe, expect, it } from "vitest";

describe("js-redux-toolkit-data-normalization", () => {
  it("loads without syntax errors", async () => {
    await expect(import("../src/slices/commentsSlice.js")).resolves.toBeDefined();
  });
});


import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-redux-toolkit-data-normalization components", () => {
  it("src/components/Comment.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/Comment.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });

  it("src/components/Post.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/Post.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });

  it("src/components/Posts.jsx defines a component", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/Posts.jsx"), "utf8");
    expect(source).toMatch(/export\s+(default\s+)?(?:function|class|const)/);
  });
});
