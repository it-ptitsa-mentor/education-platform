import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-redux-toolkit-entity-adapter", () => {
  it("src/slices/commentsSlice.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/slices/commentsSlice.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/slices/index.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/slices/index.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/slices/postsSlice.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/slices/postsSlice.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("src/slices/usersSlice.js", () => {
    const content = readFileSync(path.join(exerciseDir, "src/slices/usersSlice.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
