import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-redux-toolkit-rtk-query — tasksApi", () => {
  it("services/tasksApi.js exports an RTK Query API object", async () => {
    const module = await import("../src/services/tasksApi.js");
    const api = module.default;
    expect(api).toBeDefined();
    expect(typeof api.reducerPath).toBe("string");
    expect(typeof api.reducer).toBe("function");
    expect(typeof api.middleware).toBe("function");
  });

  it("tasksApi has getTasks, createTask, and deleteTask endpoints", async () => {
    const api = (await import("../src/services/tasksApi.js")).default;
    expect(api.endpoints.getTasks).toBeDefined();
    expect(api.endpoints.createTask).toBeDefined();
    expect(api.endpoints.deleteTask).toBeDefined();
  });
});

describe("js-redux-toolkit-rtk-query — store (services/index.js)", () => {
  it("services/index.js exports a Redux store", async () => {
    const module = await import("../src/services/index.js");
    const store = module.default;
    expect(store).toBeDefined();
    expect(typeof store.getState).toBe("function");
    expect(typeof store.dispatch).toBe("function");
  });
});

describe("js-redux-toolkit-rtk-query — components", () => {
  it("TodoBox.jsx uses RTK Query hooks", () => {
    const source = readFileSync(
      path.join(exerciseDir, "src/components/TodoBox.jsx"),
      "utf8",
    );
    // Should use at least one RTK Query hook
    const hasRtkHook =
      source.includes("useGetTasksQuery") ||
      source.includes("useCreateTaskMutation") ||
      source.includes("useDeleteTaskMutation");
    expect(hasRtkHook).toBe(true);
  });
});
