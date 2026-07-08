import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-redux-toolkit-data-normalization — slices", () => {
  it("postsSlice.js exports a slice with addManyPosts action", async () => {
    const module = await import("../src/slices/postsSlice.js");
    expect(module.default).toBeDefined();
    const slice = module.default;
    expect(typeof slice.reducer).toBe("function");
    expect(typeof slice.actions.addManyPosts).toBe("function");
  });

  it("postsSlice stores normalized posts by ID", async () => {
    const slice = (await import("../src/slices/postsSlice.js")).default;
    const reducer = slice.reducer;
    const { addManyPosts } = slice.actions;

    const posts = [
      { id: "p1", author: "u1", body: "Post 1", comments: ["c1"] },
      { id: "p2", author: "u2", body: "Post 2", comments: [] },
    ];
    const state = reducer(undefined, addManyPosts(posts));
    expect(state.ids).toContain("p1");
    expect(state.entities["p1"]).toBeDefined();
    expect(state.entities["p1"].body).toBe("Post 1");
  });

  it("commentsSlice.js exports a slice with addManyComments action", async () => {
    const module = await import("../src/slices/commentsSlice.js");
    expect(module.default).toBeDefined();
    const slice = module.default;
    expect(typeof slice.actions.addManyComments).toBe("function");
  });

  it("commentsSlice stores normalized comments by ID", async () => {
    const slice = (await import("../src/slices/commentsSlice.js")).default;
    const reducer = slice.reducer;
    const { addManyComments } = slice.actions;

    const comments = [
      { id: "c1", author: "u2", postId: "p1", text: "Comment 1" },
      { id: "c2", author: "u3", postId: "p1", text: "Comment 2" },
    ];
    const state = reducer(undefined, addManyComments(comments));
    expect(state.ids).toContain("c1");
    expect(state.entities["c1"].text).toBe("Comment 1");
  });
});

describe("js-redux-toolkit-data-normalization — components", () => {
  it("Posts.jsx uses useSelector to get posts", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/Posts.jsx"), "utf8");
    expect(source).toContain("useSelector");
  });

  it("Post.jsx uses useSelector to get author", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/Post.jsx"), "utf8");
    expect(source).toContain("useSelector");
  });

  it("Comment.jsx uses useSelector to get comment and author", () => {
    const source = readFileSync(path.join(exerciseDir, "src/components/Comment.jsx"), "utf8");
    expect(source).toContain("useSelector");
  });
});
