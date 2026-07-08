import { describe, expect, it } from "vitest";
import { createStore } from "redux";

describe("js-redux-tookit-reducers", () => {
  it("reducers.js exports a root reducer function", async () => {
    const module = await import("../reducers.js");
    const rootReducer = module.default;
    expect(typeof rootReducer).toBe("function");
  });

  it("reducer handles tasks and comments state", async () => {
    const rootReducer = (await import("../reducers.js")).default;
    const store = createStore(rootReducer);
    const state = store.getState();
    expect(state).toHaveProperty("tasks");
    expect(state).toHaveProperty("comments");
  });

  it("reducer adds a task on ADD_TASK action", async () => {
    const rootReducer = (await import("../reducers.js")).default;
    const store = createStore(rootReducer);

    store.dispatch({ type: "ADD_TASK", payload: { id: 1, name: "first task" } });
    const { tasks } = store.getState();
    expect(tasks[1]).toBeDefined();
    expect(tasks[1].name).toBe("first task");
  });

  it("reducer adds a comment on ADD_COMMENT action", async () => {
    const rootReducer = (await import("../reducers.js")).default;
    const store = createStore(rootReducer);

    store.dispatch({ type: "ADD_TASK", payload: { id: 1, name: "task" } });
    store.dispatch({ type: "ADD_COMMENT", payload: { id: 1, taskId: 1, body: "comment 1" } });
    const { comments } = store.getState();
    expect(comments[1]).toBeDefined();
    expect(comments[1].body).toBe("comment 1");
  });

  it("deleting a task also removes its comments", async () => {
    const rootReducer = (await import("../reducers.js")).default;
    const store = createStore(rootReducer);

    store.dispatch({ type: "ADD_TASK", payload: { id: 1, name: "task" } });
    store.dispatch({ type: "ADD_COMMENT", payload: { id: 1, taskId: 1, body: "comment 1" } });
    store.dispatch({ type: "ADD_COMMENT", payload: { id: 2, taskId: 1, body: "comment 2" } });

    store.dispatch({ type: "REMOVE_TASK", payload: 1 });

    const { tasks, comments } = store.getState();
    expect(tasks[1]).toBeUndefined();
    expect(comments[1]).toBeUndefined();
    expect(comments[2]).toBeUndefined();
  });
});
