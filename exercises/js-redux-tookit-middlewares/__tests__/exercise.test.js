import { describe, expect, it } from "vitest";
import { configureStore } from "@reduxjs/toolkit";

describe("js-redux-tookit-middlewares", () => {
  it("middlewares.js exports addDate function", async () => {
    const module = await import("../src/middlewares.js");
    expect(typeof module.addDate).toBe("function");
  });

  it("addDate middleware modifies ADD_TASK action to include current date in text", async () => {
    const { addDate } = await import("../src/middlewares.js");

    const tasksReducer = (state = {}, action) => {
      if (action.type === "ADD_TASK") {
        return { ...state, [action.payload.task.id]: action.payload.task };
      }
      return state;
    };

    const store = configureStore({
      reducer: { tasks: tasksReducer },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(addDate()),
    });

    store.dispatch({
      type: "ADD_TASK",
      payload: { task: { text: "Новая задача", id: "1", state: "active" } },
    });

    const task = store.getState().tasks["1"];
    expect(task).toBeDefined();
    expect(task.text).toMatch(/^Задача на/);
    expect(task.text).toContain("Новая задача");
  });

  it("addDate middleware does not modify non-ADD_TASK actions", async () => {
    const { addDate } = await import("../src/middlewares.js");

    const reducer = (state = { text: "original" }, action) => {
      if (action.type === "OTHER_ACTION") return { text: action.payload };
      return state;
    };

    const store = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(addDate()),
    });

    store.dispatch({ type: "OTHER_ACTION", payload: "unchanged" });
    expect(store.getState().text).toBe("unchanged");
  });
});
