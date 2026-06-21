import { describe, expect, it } from "vitest";
import {
  checkQuizAnswers,
  toPublicQuizDetail,
} from "./quiz-check.js";
import type { QuizManifest } from "./quiz-manifest-types.js";

const sampleQuiz: QuizManifest = {
  slug: "js-basics-hello-world",
  title: "Hello, World!",
  questions: [
    {
      id: "hello-1",
      prompt: "Pick one",
      multiple: false,
      options: [
        { id: "a", text: "wrong", correct: false },
        { id: "b", text: "right", correct: true },
      ],
    },
    {
      id: "hello-2",
      prompt: "Pick two",
      multiple: true,
      options: [
        { id: "x", text: "one", correct: true },
        { id: "y", text: "two", correct: true },
        { id: "z", text: "three", correct: false },
      ],
    },
  ],
};

describe("checkQuizAnswers", () => {
  it("passes when all answers match", () => {
    const result = checkQuizAnswers(sampleQuiz, {
      answers: {
        "hello-1": ["b"],
        "hello-2": ["x", "y"],
      },
    });

    expect(result.passed).toBe(true);
    expect(result.score).toBe(2);
    expect(result.total).toBe(2);
  });

  it("fails when a single-choice answer is wrong", () => {
    const result = checkQuizAnswers(sampleQuiz, {
      answers: {
        "hello-1": ["a"],
        "hello-2": ["x", "y"],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.results[0]?.passed).toBe(false);
  });

  it("requires exact set for multiple-choice questions", () => {
    const result = checkQuizAnswers(sampleQuiz, {
      answers: {
        "hello-1": ["b"],
        "hello-2": ["x"],
      },
    });

    expect(result.passed).toBe(false);
    expect(result.results[1]?.passed).toBe(false);
  });
});

describe("toPublicQuizDetail", () => {
  it("strips correct flags from options", () => {
    const detail = toPublicQuizDetail(sampleQuiz);

    expect(detail.questions[0]?.options).toEqual([
      { id: "a", text: "wrong" },
      { id: "b", text: "right" },
    ]);
    expect(JSON.stringify(detail)).not.toContain('"correct"');
  });
});
