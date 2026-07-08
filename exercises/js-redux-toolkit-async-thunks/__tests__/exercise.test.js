import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-redux-toolkit-async-thunks — tasksSlice", () => {
  it("tasksSlice.js exports a slice with reducer", async () => {
    const module = await import("../src/slices/tasksSlice.js");
    expect(module.default).toBeDefined();
    expect(typeof module.default.reducer).toBe("function");
  });

  it("tasksSlice exports fetchTasks async thunk", async () => {
    const module = await import("../src/slices/tasksSlice.js");
    expect(module.fetchTasks).toBeDefined();
    expect(typeof module.fetchTasks).toBe("function");
  });

  it("tasksSlice exports addTask async thunk", async () => {
    const module = await import("../src/slices/tasksSlice.js");
    expect(module.addTask).toBeDefined();
    expect(typeof module.addTask).toBe("function");
  });

  it("tasksSlice exports removeTask async thunk", async () => {
    const module = await import("../src/slices/tasksSlice.js");
    expect(module.removeTask).toBeDefined();
    expect(typeof module.removeTask).toBe("function");
  });

  it("tasksSlice initial state has items array", async () => {
    const slice = (await import("../src/slices/tasksSlice.js")).default;
    const state = slice.reducer(undefined, { type: "@@INIT" });
    expect(Array.isArray(state.items)).toBe(true);
  });
});

describe("js-redux-toolkit-async-thunks — components", () => {
  it("NewTaskForm.jsx uses useDispatch to dispatch actions", () => {
    const source = readFileSync(
      path.join(exerciseDir, "src/components/NewTaskForm.jsx"),
      "utf8",
    );
    expect(source).toContain("useDispatch");
  });

  it("Tasks.jsx uses useSelector to read tasks", () => {
    const source = readFileSync(
      path.join(exerciseDir, "src/components/Tasks.jsx"),
      "utf8",
    );
    expect(source).toContain("useSelector");
  });
});
