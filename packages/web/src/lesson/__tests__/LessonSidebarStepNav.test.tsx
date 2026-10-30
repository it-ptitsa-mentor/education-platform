import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LessonCourseSidebar } from "../LessonCourseSidebar";
import { LessonContext } from "../lesson-context";
import type { LessonContextValue } from "../lesson-context";
import type { Course, Module, Topic, LessonRef } from "../../course";

const lesson1 = {
  index: 1,
  title: "Урок первый",
  theory: "content/theory/html/intro/1.md",
  quiz: null,
  exercise: null,
};

const lesson2 = {
  index: 2,
  title: "Урок второй",
  theory: "content/theory/html/intro/2.md",
  quiz: "quiz-2",
  exercise: "ex-2",
};

const lesson3 = {
  index: 3,
  title: "Урок третий",
  theory: "content/theory/html/intro/3.md",
  quiz: null,
  exercise: null,
};

const mockTopic: Topic = {
  index: 1,
  title: "Введение",
  slug: "intro",
  course_slug: null,
  lessons: [lesson1, lesson2, lesson3],
};

const mockModule: Module = {
  index: 1,
  title: "Основы HTML",
  slug: "html",
  topics: [mockTopic],
};

const mockCourse: Course = {
  course: "Frontend",
  course_id: "frontend",
  modules: [mockModule],
};

const ref1: LessonRef = { module: mockModule, topic: mockTopic, lesson: lesson1, id: "html/intro/1", href: "learn/html/intro/1" };
const ref2: LessonRef = { module: mockModule, topic: mockTopic, lesson: lesson2, id: "html/intro/2", href: "learn/html/intro/2" };
const ref3: LessonRef = { module: mockModule, topic: mockTopic, lesson: lesson3, id: "html/intro/3", href: "learn/html/intro/3" };

const makeCtx = (
  current: LessonRef,
  prev: LessonRef | null,
  next: LessonRef | null,
): LessonContextValue => ({
  course: mockCourse,
  module: mockModule,
  topic: mockTopic,
  current,
  topicLessons: [ref1, ref2, ref3],
  allLessons: [ref1, ref2, ref3],
  prev,
  next,
  progressVersion: 0,
  refreshProgress: vi.fn(),
});

const renderNav = (
  current: LessonRef,
  prev: LessonRef | null,
  next: LessonRef | null,
  unit: "theory" | "quiz" | "exercise" = "theory",
) =>
  render(
    <MemoryRouter initialEntries={[`/${current.href}/${unit}`]}>
      <LessonContext.Provider value={makeCtx(current, prev, next)}>
        <LessonCourseSidebar />
      </LessonContext.Provider>
    </MemoryRouter>,
  );

const hrefOf = (label: string) =>
  screen.getByText(label).closest("a")?.getAttribute("href");

describe("LessonCourseSidebar — карточки ← → по шагам урока", () => {
  it("карточки живут в сайдбаре рядом с кнопкой «Навигация по теме»", () => {
    renderNav(ref2, ref1, ref3);
    const aside = screen.getByRole("complementary");
    expect(within(aside).getByRole("button", { name: /Навигация по теме/i })).toBeInTheDocument();
    expect(within(aside).getByRole("navigation", { name: "Навигация по уроку" })).toBeInTheDocument();
  });

  it("не рендерит кнопку «Отметить пройденным»", () => {
    renderNav(ref2, ref1, ref3);
    expect(screen.queryByText(/Отметить пройденным/i)).not.toBeInTheDocument();
  });

  it("теория урока с квизом: «Следующий» ведёт на квиз этого урока, а не на следующий урок", () => {
    renderNav(ref2, ref1, ref3);
    expect(hrefOf("Следующий →")).toBe("/learn/html/intro/2/quiz");
    expect(screen.queryByText("Урок третий")).not.toBeInTheDocument();
  });

  it("квиз: «Следующий» ведёт на практику, «Предыдущий» — на теорию этого урока", () => {
    renderNav(ref2, ref1, ref3, "quiz");
    expect(hrefOf("Следующий →")).toBe("/learn/html/intro/2/exercise");
    expect(hrefOf("← Предыдущий")).toBe("/learn/html/intro/2/theory");
  });

  it("практика: «Следующий» ведёт на теорию следующего урока, «Предыдущий» — на квиз", () => {
    renderNav(ref2, ref1, ref3, "exercise");
    expect(hrefOf("Следующий →")).toBe("/learn/html/intro/3/theory");
    expect(screen.getByText("Урок третий")).toBeInTheDocument();
    expect(hrefOf("← Предыдущий")).toBe("/learn/html/intro/2/quiz");
  });

  it("урок без квиза и практики: «Следующий» ведёт на теорию следующего урока с его названием", () => {
    renderNav(ref1, null, ref2);
    expect(hrefOf("Следующий →")).toBe("/learn/html/intro/2/theory");
    expect(screen.getByText("Урок второй")).toBeInTheDocument();
  });

  it("«Предыдущий» ведёт на последний шаг прошлого урока (практику, если она есть)", () => {
    renderNav(ref3, ref2, null);
    expect(hrefOf("← Предыдущий")).toBe("/learn/html/intro/2/exercise");
    expect(screen.getByText("Урок второй")).toBeInTheDocument();
  });

  it("не рендерит карточку «Предыдущий» для первого урока", () => {
    renderNav(ref1, null, ref2);
    expect(screen.queryByText("← Предыдущий")).not.toBeInTheDocument();
    expect(screen.getByText("Следующий →")).toBeInTheDocument();
  });

  it("не рендерит карточку «Следующий» для последнего урока без квиза и практики", () => {
    renderNav(ref3, ref2, null);
    expect(screen.queryByText("Следующий →")).not.toBeInTheDocument();
    expect(screen.getByText("← Предыдущий")).toBeInTheDocument();
  });
});
