import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildApp } from "./app.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

describe("exercise API", () => {
  const app = buildApp({
    exercisesRoot: path.join(repoRoot, "exercises"),
  });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("lists available js exercises with categories", async () => {
    const response = await app.inject({ method: "GET", url: "/api/exercises" });

    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      exercises: {
        slug: string;
        categoryId: string;
        categoryName: string;
      }[];
    };
    const jsVariables = body.exercises.find((e) => e.slug === "js-variables");
    expect(jsVariables).toBeDefined();
    expect(jsVariables?.categoryId).toBe("javascript");
    expect(jsVariables?.categoryName).toBe("JavaScript");
  });

  it("returns starter code for an exercise", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/exercises/js-variables",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      title: string;
      files: Record<string, string>;
    };
    expect(body.title).toBe("Переменные");
    expect(body.files["solution.js"]).toContain("console.log");
  });

  it("checks student solution against vitest", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/exercises/js-variables/check",
      payload: {
        files: {
          "solution.js": `const pet = "Dragon";
console.log(pet);
console.log(pet);
`,
        },
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as { passed: boolean; stdout: string };
    expect(body.passed).toBe(true);
    expect(body.stdout.length).toBeGreaterThan(0);
  });
});
