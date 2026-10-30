import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Course, LessonRef, Module, Topic } from "../../course";
import { LessonContext, type LessonContextValue } from "../lesson-context";
import { LessonQuizStep } from "../LessonQuizStep";

const markUnitDone = vi.fn();
vi.mock("../../course", () => ({
  markUnitDone: (...args: unknown[]) => markUnitDone(...args),
}));

// QuizRunner подменён кнопкой «пройти», которая дёргает onPassed — как настоящий при result.passed.
vi.mock("../../components/QuizRunner", () => ({
  QuizRunner: ({ onPassed }: { onPassed?: () => void }) => (
    <button type="button" onClick={() => onPassed?.()}>
      пройти квиз
    </button>
  ),
}));

const withExercise = { index: 1, title: "Урок с практикой", theory: "t1.md", quiz: "q1", exercise: "ex1" };
const quizOnly = { index: 2, title: "Урок только с квизом", theory: "t2.md", quiz: "q2", exercise: null };
const last = { index: 3, title: "Последний", theory: "t3.md", quiz: "q3", exercise: null };

const topic: Topic = { index: 1, title: "Тема", slug: "intro", course_slug: null, lessons: [withExercise, quizOnly, last] };
const mod: Module = { index: 1, title: "HTML", slug: "html", topics: [topic] };
const course: Course = { course: "Frontend", course_id: "frontend", modules: [mod] };
const ref = (lesson: typeof withExercise | typeof quizOnly | typeof last): LessonRef => ({
  module: mod,
  topic,
  lesson,
  id: `html/intro/${lesson.index}`,
  href: `learn/html/intro/${lesson.index}`,
});
const refs = [ref(withExercise), ref(quizOnly), ref(last)];

const refreshProgress = vi.fn();
const renderStep = (current: LessonRef) => {
  const ctx: LessonContextValue = {
    course,
    module: mod,
    topic,
    current,
    topicLessons: refs,
    allLessons: refs,
    prev: null,
    next: null,
    progressVersion: 0,
    refreshProgress,
  };
  return render(
    <MemoryRouter>
      <LessonContext.Provider value={ctx}>
        <LessonQuizStep />
      </LessonContext.Provider>
    </MemoryRouter>,
  );
};

describe("LessonQuizStep", () => {
  beforeEach(() => {
    markUnitDone.mockClear();
    refreshProgress.mockClear();
  });

  it("onPassed отмечает квиз пройденным и обновляет прогресс", () => {
    renderStep(refs[0]);
    fireEvent.click(screen.getByText("пройти квиз"));
    expect(markUnitDone).toHaveBeenCalledWith("html/intro/1", "quiz");
    expect(refreshProgress).toHaveBeenCalledTimes(1);
  });

  it("«Далее» в теле квиза не рендерится — она переехала в хедер LessonLayout", () => {
    renderStep(refs[0]);
    fireEvent.click(screen.getByText("пройти квиз"));
    expect(screen.queryByRole("link", { name: /Далее/ })).not.toBeInTheDocument();
  });
});
