import { describe, expect, it } from "vitest";

describe("js-redux-toolkit-redux", () => {
  it("store.js exports a function that creates a Redux store", async () => {
    const module = await import("../store.js");
    const makeStore = module.default;
    expect(typeof makeStore).toBe("function");

    const store = makeStore({});
    expect(typeof store.getState).toBe("function");
    expect(typeof store.dispatch).toBe("function");
    expect(typeof store.subscribe).toBe("function");
  });

  it("store adds a task on ADD_TASK action", async () => {
    const makeStore = (await import("../store.js")).default;
    const store = makeStore({});

    store.dispatch({ type: "ADD_TASK", payload: { id: "1", text: "Task 1", state: "active" } });
    const state = store.getState();
    expect(state["1"]).toBeDefined();
    expect(state["1"].text).toBe("Task 1");
  });

  it("store removes a task on REMOVE_TASK action", async () => {
    const makeStore = (await import("../store.js")).default;
    const initialState = { "1": { id: "1", text: "Existing task", state: "active" } };
    const store = makeStore(initialState);

    store.dispatch({ type: "REMOVE_TASK", payload: "1" });
    const state = store.getState();
    expect(state["1"]).toBeUndefined();
  });

  it("store starts with the given initial state", async () => {
    const makeStore = (await import("../store.js")).default;
    const initial = {
      "1": { id: "1", text: "First", state: "active" },
      "2": { id: "2", text: "Second", state: "active" },
    };
    const store = makeStore(initial);
    const state = store.getState();
    expect(Object.keys(state)).toHaveLength(2);
    expect(state["1"].text).toBe("First");
    expect(state["2"].text).toBe("Second");
  });
});
