import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LessonSideNav } from "../LessonSideNav";
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

const allLessons = [ref1, ref2, ref3];

const makeCtx = (current: LessonRef, refreshProgress = vi.fn()): LessonContextValue => ({
  course: mockCourse,
  module: mockModule,
  topic: mockTopic,
  current,
  topicLessons: allLessons,
  allLessons,
  prev: null,
  next: null,
  progressVersion: 0,
  refreshProgress,
});

const renderNav = (current: LessonRef, activeUnit: "theory" | "quiz" | "exercise" = "theory", refreshProgress = vi.fn()) =>
  render(
    <MemoryRouter>
      <LessonContext.Provider value={makeCtx(current, refreshProgress)}>
        <LessonSideNav activeUnit={activeUnit} />
      </LessonContext.Provider>
    </MemoryRouter>
  );

describe("LessonSideNav", () => {
  it("рендерит ссылку «Далее» для первого урока", () => {
    renderNav(ref1);
    expect(screen.getByRole("link", { name: /Далее/i })).toBeInTheDocument();
    expect(screen.getByText("Урок второй")).toBeInTheDocument();
  });

  it("рендерит ссылку «Назад» для последнего урока", () => {
    renderNav(ref3);
    expect(screen.getByRole("link", { name: /Назад/i })).toBeInTheDocument();
    expect(screen.getByText("Урок второй")).toBeInTheDocument();
  });

  it("рендерит обе ссылки для среднего урока", () => {
    renderNav(ref2);
    expect(screen.getByRole("link", { name: /Назад/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Далее/i })).toBeInTheDocument();
  });

  it("возвращает null, когда нет предыдущего и следующего", () => {
    // Единственный урок без соседей
    const onlyLesson = { ...lesson1 };
    const onlyTopic: Topic = { ...mockTopic, lessons: [onlyLesson] };
    const onlyModule: Module = { ...mockModule, topics: [onlyTopic] };
    const onlyRef: LessonRef = { module: onlyModule, topic: onlyTopic, lesson: onlyLesson, id: "html/intro/1", href: "learn/html/intro/1" };
    const ctx: LessonContextValue = { ...makeCtx(onlyRef), allLessons: [onlyRef] };
    const { container } = render(
      <MemoryRouter>
        <LessonContext.Provider value={ctx}>
          <LessonSideNav activeUnit="theory" />
        </LessonContext.Provider>
      </MemoryRouter>
    );
    // Навигации нет — nav не рендерится
    expect(container.querySelector("nav")).not.toBeInTheDocument();
  });

  it("вызывает refreshProgress при клике «Далее» в режиме theory", () => {
    const refreshProgress = vi.fn();
    renderNav(ref1, "theory", refreshProgress);
    fireEvent.click(screen.getByRole("link", { name: /Далее/i }));
    expect(refreshProgress).toHaveBeenCalledOnce();
  });
});
