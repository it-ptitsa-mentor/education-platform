import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LessonEndNav } from "../LessonEndNav";
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
  quiz: null,
  exercise: null,
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
  refreshProgress = vi.fn(),
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
  refreshProgress,
});

const renderEndNav = (
  current: LessonRef,
  prev: LessonRef | null,
  next: LessonRef | null,
  refreshProgress = vi.fn(),
) =>
  render(
    <MemoryRouter>
      <LessonContext.Provider value={makeCtx(current, prev, next, refreshProgress)}>
        <LessonEndNav />
      </LessonContext.Provider>
    </MemoryRouter>,
  );

describe("LessonEndNav", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("рендерит кнопку «Отметить пройденным» и пояснение", () => {
    renderEndNav(ref2, ref1, ref3);
    expect(
      screen.getByRole("button", { name: /Отметить пройденным/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Дочитал — отметь, и урок встанет в прогресс курса/i),
    ).toBeInTheDocument();
  });

  it("рендерит карточки предыдущего и следующего уроков с названиями", () => {
    renderEndNav(ref2, ref1, ref3);
    expect(screen.getByText("← Предыдущий")).toBeInTheDocument();
    expect(screen.getByText("Урок первый")).toBeInTheDocument();
    expect(screen.getByText("Следующий →")).toBeInTheDocument();
    expect(screen.getByText("Урок третий")).toBeInTheDocument();
  });

  it("не рендерит карточку «Предыдущий» для первого урока", () => {
    renderEndNav(ref1, null, ref2);
    expect(screen.queryByText("← Предыдущий")).not.toBeInTheDocument();
    expect(screen.getByText("Следующий →")).toBeInTheDocument();
  });

  it("не рендерит карточку «Следующий» для последнего урока", () => {
    renderEndNav(ref3, ref2, null);
    expect(screen.queryByText("Следующий →")).not.toBeInTheDocument();
    expect(screen.getByText("← Предыдущий")).toBeInTheDocument();
  });

  it("клик по кнопке отмечает theory-юнит пройденным через markUnitDone и вызывает refreshProgress", () => {
    const refreshProgress = vi.fn();
    renderEndNav(ref2, ref1, ref3, refreshProgress);

    fireEvent.click(screen.getByRole("button", { name: /Отметить пройденным/i }));

    expect(refreshProgress).toHaveBeenCalledOnce();
    const stored = JSON.parse(localStorage.getItem("ptitsa-course-progress") || "{}");
    expect(stored[ref2.id].theory).toBe(true);
  });

  it("если урок уже отмечен пройденным в localStorage, кнопка сразу отражает это состояние", () => {
    localStorage.setItem(
      "ptitsa-course-progress",
      JSON.stringify({ [ref2.id]: { theory: true } }),
    );
    renderEndNav(ref2, ref1, ref3);
    expect(
      screen.getByRole("button", { name: /Урок пройден/i }),
    ).toBeInTheDocument();
  });
});
