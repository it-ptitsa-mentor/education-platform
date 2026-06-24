import { describe, expect, it } from "vitest";
import type { Lesson } from "../course";
import {
  isUnitAvailable,
  lessonUnitPath,
  lessonUnits,
  nextUnit,
  prevUnit,
} from "./lesson-units";

const baseLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  index: 1,
  title: "Test",
  theory: "content/theory/m/t/1.md",
  quiz: "quiz-slug",
  exercise: "exercise-slug",
  ...overrides,
});

describe("lessonUnits", () => {
  it("always includes theory", () => {
    expect(lessonUnits(baseLesson({ quiz: null, exercise: null }))).toEqual([
      "theory",
    ]);
  });

  it("omits null quiz and exercise", () => {
    expect(
      lessonUnits(baseLesson({ exercise: null })),
    ).toEqual(["theory", "quiz"]);
  });

  it("navigates units in order", () => {
    const lesson = baseLesson();
    expect(nextUnit(lesson, "theory")).toBe("quiz");
    expect(nextUnit(lesson, "quiz")).toBe("exercise");
    expect(nextUnit(lesson, "exercise")).toBeNull();
    expect(prevUnit(lesson, "exercise")).toBe("quiz");
    expect(prevUnit(lesson, "theory")).toBeNull();
  });

  it("builds unit URLs from lesson ref", () => {
    const ref = {
      id: "m1/t1/1",
      href: "learn/m1/t1/1",
      lesson: baseLesson(),
      module: {} as never,
      topic: {} as never,
    };
    expect(lessonUnitPath(ref, "quiz")).toBe("/learn/m1/t1/1/quiz");
  });

  it("checks unit availability", () => {
    const lesson = baseLesson({ quiz: null });
    expect(isUnitAvailable(lesson, "theory")).toBe(true);
    expect(isUnitAvailable(lesson, "quiz")).toBe(false);
  });
});
