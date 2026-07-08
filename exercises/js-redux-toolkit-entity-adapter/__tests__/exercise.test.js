import { describe, expect, it } from "vitest";

describe("js-redux-toolkit-entity-adapter — usersSlice", () => {
  it("usersSlice.js exports a slice with entity adapter reducers", async () => {
    const module = await import("../src/slices/usersSlice.js");
    expect(module.default).toBeDefined();
    const slice = module.default;
    expect(typeof slice.reducer).toBe("function");
    expect(typeof slice.actions.addManyUsers).toBe("function");
  });

  it("usersSlice handles addManyUsers action", async () => {
    const slice = (await import("../src/slices/usersSlice.js")).default;
    const reducer = slice.reducer;
    const { addManyUsers } = slice.actions;

    const users = [
      { id: "u1", username: "user1", name: "User 1" },
      { id: "u2", username: "user2", name: "User 2" },
    ];
    const state = reducer(undefined, addManyUsers(users));
    expect(state.ids).toHaveLength(2);
    expect(state.entities["u1"]).toBeDefined();
    expect(state.entities["u1"].name).toBe("User 1");
  });
});

describe("js-redux-toolkit-entity-adapter — postsSlice", () => {
  it("postsSlice.js exports a slice with addOnePost and addManyPosts", async () => {
    const module = await import("../src/slices/postsSlice.js");
    expect(module.default).toBeDefined();
    const slice = module.default;
    expect(typeof slice.actions.addOnePost).toBe("function");
    expect(typeof slice.actions.addManyPosts).toBe("function");
  });

  it("postsSlice handles addOnePost and updateOnePost actions", async () => {
    const slice = (await import("../src/slices/postsSlice.js")).default;
    const reducer = slice.reducer;
    const { addOnePost, updateOnePost } = slice.actions;

    let state = reducer(undefined, addOnePost({ id: "p1", body: "Original" }));
    expect(state.entities["p1"].body).toBe("Original");

    state = reducer(state, updateOnePost({ id: "p1", changes: { body: "Updated" } }));
    expect(state.entities["p1"].body).toBe("Updated");
  });
});

describe("js-redux-toolkit-entity-adapter — commentsSlice", () => {
  it("commentsSlice.js exports a slice with addOneComment and addManyComments", async () => {
    const module = await import("../src/slices/commentsSlice.js");
    expect(module.default).toBeDefined();
    const slice = module.default;
    expect(typeof slice.actions.addOneComment).toBe("function");
    expect(typeof slice.actions.addManyComments).toBe("function");
  });
});

describe("js-redux-toolkit-entity-adapter — store (index.js)", () => {
  it("index.js exports a store with posts, comments, users keys", async () => {
    const module = await import("../src/slices/index.js");
    const store = module.default;
    expect(store).toBeDefined();
    expect(typeof store.dispatch).toBe("function");
    const state = store.getState();
    expect(state).toHaveProperty("posts");
    expect(state).toHaveProperty("comments");
    expect(state).toHaveProperty("users");
  });
});
