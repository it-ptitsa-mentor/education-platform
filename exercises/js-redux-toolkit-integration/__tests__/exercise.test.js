import { describe, expect, it } from "vitest";

describe("js-redux-toolkit-integration — tasksSlice", () => {
  it("tasksSlice.js exports a slice with reducer and addTask action", async () => {
    const module = await import("../src/slices/tasksSlice.js");
    const slice = module.default;
    expect(slice).toBeDefined();
    expect(typeof slice.reducer).toBe("function");
    expect(typeof slice.actions.addTask).toBe("function");
  });

  it("addTask prepends a task to the tasks list", async () => {
    const slice = (await import("../src/slices/tasksSlice.js")).default;
    const reducer = slice.reducer;
    const { addTask } = slice.actions;

    const state0 = reducer(undefined, { type: "@@INIT" });
    const state1 = reducer(state0, addTask({ id: "1", text: "Task 1" }));
    expect(state1[0]).toMatchObject({ id: "1", text: "Task 1" });

    const state2 = reducer(state1, addTask({ id: "2", text: "Task 2" }));
    // New task should be at the beginning
    expect(state2[0]).toMatchObject({ id: "2", text: "Task 2" });
    expect(state2[1]).toMatchObject({ id: "1", text: "Task 1" });
  });
});

describe("js-redux-toolkit-integration — store", () => {
  it("src/slices/index.js exports a Redux store with tasksStore key", async () => {
    const module = await import("../src/slices/index.js");
    const store = module.default;
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe("function");
    expect(typeof store.dispatch).toBe("function");
    expect(store.getState()).toHaveProperty("tasksStore");
  });
});
