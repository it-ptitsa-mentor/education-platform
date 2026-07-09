import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LessonCourseSidebar } from "../LessonCourseSidebar";
import { LessonContext } from "../lesson-context";
import type { LessonContextValue } from "../lesson-context";
import type { Course, Module, Topic, LessonRef } from "../../course";

const lesson1 = {
  index: 1,
  title: "Введение в HTML",
  theory: "content/theory/html/intro/1.md",
  quiz: null,
  exercise: null,
};

const lesson2 = {
  index: 2,
  title: "Основные теги",
  theory: "content/theory/html/intro/2.md",
  quiz: "quiz-2",
  exercise: null,
};

const mockTopic: Topic = {
  index: 1,
  title: "Введение",
  slug: "intro",
  course_slug: null,
  lessons: [lesson1, lesson2],
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

const lessonRef1: LessonRef = {
  module: mockModule,
  topic: mockTopic,
  lesson: lesson1,
  id: "html/intro/1",
  href: "learn/html/intro/1",
};

const lessonRef2: LessonRef = {
  module: mockModule,
  topic: mockTopic,
  lesson: lesson2,
  id: "html/intro/2",
  href: "learn/html/intro/2",
};

const makeCtx = (currentId: string): LessonContextValue => {
  const current = currentId === lessonRef1.id ? lessonRef1 : lessonRef2;
  return {
    course: mockCourse,
    module: mockModule,
    topic: mockTopic,
    current,
    topicLessons: [lessonRef1, lessonRef2],
    allLessons: [lessonRef1, lessonRef2],
    prev: null,
    next: null,
    progressVersion: 0,
    refreshProgress: vi.fn(),
  };
};

const renderSidebar = (currentId = lessonRef1.id, onNavigate?: () => void) =>
  render(
    <MemoryRouter>
      <LessonContext.Provider value={makeCtx(currentId)}>
        <LessonCourseSidebar activeUnit="theory" onNavigate={onNavigate} />
      </LessonContext.Provider>
    </MemoryRouter>
  );

describe("LessonCourseSidebar", () => {
  it("рендерит заголовок модуля и темы", () => {
    renderSidebar();
    expect(screen.getByText("Основы HTML")).toBeInTheDocument();
    expect(screen.getByText("Введение")).toBeInTheDocument();
  });

  it("рендерит все уроки из темы", () => {
    renderSidebar();
    expect(screen.getByText("Введение в HTML")).toBeInTheDocument();
    expect(screen.getByText("Основные теги")).toBeInTheDocument();
  });

  it("помечает текущий урок как активный", () => {
    renderSidebar(lessonRef1.id);
    const activeLink = screen.getByRole("link", { name: /Введение в HTML/ });
    expect(activeLink).toHaveClass("is-active");
    expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  it("не помечает другие уроки как активные", () => {
    renderSidebar(lessonRef1.id);
    const inactiveLink = screen.getByRole("link", { name: /Основные теги/ });
    expect(inactiveLink).not.toHaveClass("is-active");
    expect(inactiveLink).not.toHaveAttribute("aria-current");
  });

  it("вызывает onNavigate при клике на урок", () => {
    const onNavigate = vi.fn();
    renderSidebar(lessonRef1.id, onNavigate);
    fireEvent.click(screen.getByRole("link", { name: /Основные теги/ }));
    expect(onNavigate).toHaveBeenCalledOnce();
  });

  it("рендерит ссылки с правильными номерами уроков", () => {
    renderSidebar();
    // Первый урок имеет номер "01", второй — "02"
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
  });
});
