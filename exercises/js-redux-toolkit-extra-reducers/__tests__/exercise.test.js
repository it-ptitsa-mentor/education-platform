import { describe, expect, it } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "../src/slices/usersSlice.js";

const { removeUser, addManyUsers } = usersSlice.actions;

describe("js-redux-toolkit-extra-reducers — postsSlice", () => {
  it("postsSlice.js exports a slice with removePost action", async () => {
    const module = await import("../src/slices/postsSlice.js");
    expect(module.default).toBeDefined();
    const slice = module.default;
    expect(typeof slice.reducer).toBe("function");
    expect(typeof slice.actions.removePost).toBe("function");
  });

  it("postsSlice removes posts when user is deleted (extraReducer)", async () => {
    const postsSlice = (await import("../src/slices/postsSlice.js")).default;

    const store = configureStore({
      reducer: {
        users: usersSlice.reducer,
        posts: postsSlice.reducer,
      },
    });

    store.dispatch(addManyUsers([{ id: "u1", name: "Alice" }, { id: "u2", name: "Bob" }]));
    store.dispatch(postsSlice.actions.addManyPosts([
      { id: "p1", author: "u1", body: "Post 1" },
      { id: "p2", author: "u2", body: "Post 2" },
    ]));

    store.dispatch(removeUser("u1"));

    const state = store.getState();
    expect(state.posts.entities["p1"]).toBeUndefined();
    expect(state.posts.entities["p2"]).toBeDefined();
  });
});

describe("js-redux-toolkit-extra-reducers — commentsSlice", () => {
  it("commentsSlice.js exports a slice", async () => {
    const module = await import("../src/slices/commentsSlice.js");
    expect(module.default).toBeDefined();
    expect(typeof module.default.reducer).toBe("function");
  });

  it("commentsSlice removes comments when user is deleted (extraReducer)", async () => {
    const postsSlice = (await import("../src/slices/postsSlice.js")).default;
    const commentsSlice = (await import("../src/slices/commentsSlice.js")).default;

    const store = configureStore({
      reducer: {
        users: usersSlice.reducer,
        posts: postsSlice.reducer,
        comments: commentsSlice.reducer,
      },
    });

    store.dispatch(addManyUsers([{ id: "u1", name: "Alice" }, { id: "u2", name: "Bob" }]));
    store.dispatch(postsSlice.actions.addManyPosts([
      { id: "p1", author: "u2", body: "Post" },
    ]));
    store.dispatch(commentsSlice.actions.addManyComments([
      { id: "c1", author: "u1", postId: "p1", text: "By Alice" },
      { id: "c2", author: "u2", postId: "p1", text: "By Bob" },
    ]));

    store.dispatch(removeUser("u1"));

    const { comments } = store.getState();
    expect(comments.entities["c1"]).toBeUndefined();
    expect(comments.entities["c2"]).toBeDefined();
  });

  it("commentsSlice removes comments when post is deleted (extraReducer)", async () => {
    const postsSlice = (await import("../src/slices/postsSlice.js")).default;
    const commentsSlice = (await import("../src/slices/commentsSlice.js")).default;

    const store = configureStore({
      reducer: {
        users: usersSlice.reducer,
        posts: postsSlice.reducer,
        comments: commentsSlice.reducer,
      },
    });

    store.dispatch(postsSlice.actions.addManyPosts([
      { id: "p1", author: "u1", body: "Post 1" },
      { id: "p2", author: "u2", body: "Post 2" },
    ]));
    store.dispatch(commentsSlice.actions.addManyComments([
      { id: "c1", author: "u1", postId: "p1", text: "C1" },
      { id: "c2", author: "u2", postId: "p2", text: "C2" },
    ]));

    // Remove post 1 (passes post object, per the hint)
    store.dispatch(postsSlice.actions.removePost({ id: "p1", author: "u1", body: "Post 1" }));

    const { comments } = store.getState();
    expect(comments.entities["c1"]).toBeUndefined();
    expect(comments.entities["c2"]).toBeDefined();
  });
});
