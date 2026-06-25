import { describe, expect, it } from "vitest";
import type { Lesson, LessonRef } from "../course";
import {
  isUnitAvailable,
  LESSON_CONTINUE_LABEL,
  lessonExerciseContinueTarget,
  lessonFooterNext,
  lessonFooterPrev,
  lessonQuizContinueTarget,
  lessonTheoryContinueTarget,
  lessonUnitPath,
  lessonUnits,
  nextUnit,
  preferredLessonUnit,
  prevUnit,
  topicEntryPath,
} from "./lesson-units";

const baseLesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  index: 1,
  title: "Test",
  theory: "content/theory/m/t/1.md",
  quiz: "quiz-slug",
  exercise: "exercise-slug",
  ...overrides,
});

const ref = (
  lesson: Lesson,
  topicLessons: Lesson[] = [lesson],
): LessonRef => ({
  id: `m1/t1/${lesson.index}`,
  href: `learn/m1/t1/${lesson.index}`,
  lesson,
  module: { slug: "m1" } as never,
  topic: { slug: "t1", lessons: topicLessons } as never,
});

const allRefs = (lessons: Lesson[]): LessonRef[] =>
  lessons.map((l) => ref(l, lessons));

describe("preferredLessonUnit", () => {
  it("returns preferred unit when available", () => {
    const lesson = baseLesson();
    expect(preferredLessonUnit(lesson, "exercise")).toBe("exercise");
    expect(preferredLessonUnit(lesson, "quiz")).toBe("quiz");
  });

  it("falls back to first unit when preferred is unavailable", () => {
    const lesson = baseLesson({ quiz: null, exercise: null });
    expect(preferredLessonUnit(lesson, "exercise")).toBe("theory");
  });
});

describe("lessonUnits", () => {
  it("always includes theory", () => {
    expect(lessonUnits(baseLesson({ quiz: null, exercise: null }))).toEqual([
      "theory",
    ]);
  });

  it("omits null quiz and exercise", () => {
    expect(lessonUnits(baseLesson({ exercise: null }))).toEqual([
      "theory",
      "quiz",
    ]);
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
    expect(lessonUnitPath(ref(baseLesson()), "quiz")).toBe(
      "/learn/m1/t1/1/quiz",
    );
  });

  it("theory continue links to next lesson when current has no quiz", () => {
    const lesson1 = baseLesson({ index: 1, quiz: null, exercise: null });
    const lesson2 = baseLesson({
      index: 2,
      title: "Quiz lesson",
      quiz: "some-quiz",
    });
    const refs = allRefs([lesson1, lesson2]);
    expect(lessonTheoryContinueTarget(refs[0], refs)).toEqual({
      type: "route",
      to: "/learn/m1/t1/2/theory",
      label: LESSON_CONTINUE_LABEL,
    });
  });

  it("theory continue links to own quiz when lesson has quiz", () => {
    const lesson = baseLesson({ index: 3, quiz: "my-quiz" });
    const refs = allRefs([lesson]);
    expect(lessonTheoryContinueTarget(refs[0], refs)).toEqual({
      type: "route",
      to: "/learn/m1/t1/3/quiz",
      label: LESSON_CONTINUE_LABEL,
    });
  });

  it("quiz continue links to exercise then next lesson", () => {
    const lesson = baseLesson({ index: 1 });
    const refs = allRefs([lesson]);
    expect(lessonQuizContinueTarget(refs[0], refs)).toEqual({
      type: "route",
      to: "/learn/m1/t1/1/exercise",
      label: LESSON_CONTINUE_LABEL,
    });

    const noEx = baseLesson({ index: 2, exercise: null, title: "Only quiz" });
    const nextL = baseLesson({ index: 3, title: "Next" });
    const multi = allRefs([lesson, noEx, nextL]);
    expect(lessonQuizContinueTarget(multi[1], multi)).toEqual({
      type: "route",
      to: "/learn/m1/t1/3/theory",
      label: LESSON_CONTINUE_LABEL,
    });
  });

  it("exercise continue links to next lesson theory", () => {
    const l1 = baseLesson({ index: 1 });
    const l2 = baseLesson({ index: 2, title: "Two" });
    const refs = allRefs([l1, l2]);
    expect(lessonExerciseContinueTarget(refs[0], refs)).toEqual({
      type: "route",
      to: "/learn/m1/t1/2/theory",
      label: LESSON_CONTINUE_LABEL,
    });
  });

  it("topicEntryPath", () => {
    expect(topicEntryPath("mod", "topic")).toBe("/learn/mod/topic/1/theory");
  });

  it("checks unit availability", () => {
    const lesson = baseLesson({ quiz: null });
    expect(isUnitAvailable(lesson, "theory")).toBe(true);
    expect(isUnitAvailable(lesson, "quiz")).toBe(false);
  });

  it("footer prev links to previous unit in lesson", () => {
    const lesson = baseLesson({ index: 1 });
    const refs = allRefs([lesson]);
    expect(lessonFooterPrev(refs[0], refs, "quiz")).toEqual({
      to: "/learn/m1/t1/1/theory",
      title: "Теория",
    });
  });

  it("footer prev links to last unit of previous lesson on theory", () => {
    const l1 = baseLesson({ index: 1, title: "First" });
    const l2 = baseLesson({ index: 2, title: "Second" });
    const refs = allRefs([l1, l2]);
    expect(lessonFooterPrev(refs[1], refs, "theory")).toEqual({
      to: "/learn/m1/t1/1/exercise",
      title: "First",
      hint: "Практика",
    });
  });

  it("footer next links to next unit with readable title", () => {
    const lesson = baseLesson({ index: 1 });
    const refs = allRefs([lesson]);
    expect(lessonFooterNext(refs[0], refs, "theory")).toEqual({
      to: "/learn/m1/t1/1/quiz",
      title: "Квиз",
    });
    expect(lessonFooterNext(refs[0], refs, "quiz")).toEqual({
      to: "/learn/m1/t1/1/exercise",
      title: "Практика",
    });
  });

  it("footer next links to next lesson theory after exercise", () => {
    const l1 = baseLesson({ index: 1, title: "One" });
    const l2 = baseLesson({ index: 2, title: "Two" });
    const refs = allRefs([l1, l2]);
    expect(lessonFooterNext(refs[0], refs, "exercise")).toEqual({
      to: "/learn/m1/t1/2/theory",
      title: "Two",
      hint: "Теория",
    });
  });
});
