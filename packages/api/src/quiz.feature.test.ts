import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { QuizManifest } from "@education-platform/shared";
import { buildApp } from "./app.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

const loadFixtureQuiz = async () => {
  const raw = await readFile(
    path.join(repoRoot, "quizzes/js-basics-hello-world/quiz.json"),
    "utf8",
  );
  return JSON.parse(raw) as QuizManifest;
};

describe("quiz API", () => {
  const app = buildApp({
    exercisesRoot: path.join(repoRoot, "exercises"),
    quizzesRoot: path.join(repoRoot, "quizzes"),
  });

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("lists imported quizzes with categories", async () => {
    const response = await app.inject({ method: "GET", url: "/api/quizzes" });

    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      quizzes: { slug: string; categoryId: string; categoryName: string }[];
    };
    const quiz = body.quizzes.find((item) => item.slug === "js-basics-hello-world");
    expect(quiz).toBeDefined();
    expect(quiz?.categoryId).toBe("js-basics");
  });

  it("returns quiz without correct flags", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/quizzes/js-basics-hello-world",
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      title: string;
      questions: { options: { id: string; text: string; correct?: boolean }[] }[];
    };
    expect(body.title).toBe("Hello, World!");
    expect(body.questions[0]?.options[0]?.correct).toBeUndefined();
  });

  it("checks quiz answers", async () => {
    const fixture = await loadFixtureQuiz();
    const answers = Object.fromEntries(
      fixture.questions.map((question) => [
        question.id,
        question.options.filter((option) => option.correct).map((option) => option.id),
      ]),
    );

    const response = await app.inject({
      method: "POST",
      url: "/api/quizzes/js-basics-hello-world/check",
      payload: { answers },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as { passed: boolean; score: number; total: number };
    expect(body.passed).toBe(true);
    expect(body.score).toBe(fixture.questions.length);
    expect(body.total).toBe(fixture.questions.length);
  });
});
