// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-redux-toolkit-slices — commentsSlice", () => {
  it("commentsSlice.js exports a slice with reducer", async () => {
    const module = await import("../src/slices/commentsSlice.js");
    expect(module.default).toBeDefined();
    expect(typeof module.default.reducer).toBe("function");
  });

  it("commentsSlice has addComments action creator", async () => {
    const slice = (await import("../src/slices/commentsSlice.js")).default;
    expect(typeof slice.actions.addComments).toBe("function");
  });

  it("addComments action sets comments in state", async () => {
    const slice = (await import("../src/slices/commentsSlice.js")).default;
    const reducer = slice.reducer;
    const { addComments } = slice.actions;

    const initial = reducer(undefined, { type: "@@INIT" });
    const comments = [
      { id: "comment1", author: "user2", text: "Первый комментарий" },
      { id: "comment2", author: "user3", text: "Второй комментарий" },
    ];
    const state = reducer(initial, addComments(comments));
    expect(state.items).toBeDefined();
    expect(state.items).toHaveLength(2);
    expect(state.items[0].text).toBe("Первый комментарий");
  });
});

describe("js-redux-toolkit-slices — store (index.js)", () => {
  it("index.js exports a store with comments slice", async () => {
    const module = await import("../src/slices/index.js");
    const store = module.default;
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe("function");
    expect(store.getState()).toHaveProperty("comments");
  });
});

describe("js-redux-toolkit-slices — components", () => {
  it("App.jsx dispatches addComments to store", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/App.jsx"), "utf8");
    expect(source).toContain("useDispatch");
  });

  it("Comment.jsx uses useSelector to get comment and author", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/Comment.jsx"), "utf8");
    expect(source).toContain("useSelector");
  });
});
