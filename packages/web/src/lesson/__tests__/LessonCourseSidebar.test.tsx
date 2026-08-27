import { render, screen, fireEvent, within } from "@testing-library/react";
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

const renderSidebar = (currentId = lessonRef1.id) =>
  render(
    <MemoryRouter>
      <LessonContext.Provider value={makeCtx(currentId)}>
        <LessonCourseSidebar />
      </LessonContext.Provider>
    </MemoryRouter>
  );

describe("LessonCourseSidebar", () => {
  it("рендерит заголовок модуля и темы", () => {
    renderSidebar();
    expect(screen.getByText("Основы HTML")).toBeInTheDocument();
    expect(screen.getByText("Введение")).toBeInTheDocument();
  });

  it("рендерит компактную кнопку «Навигация по теме» вместо постоянного списка уроков", () => {
    renderSidebar();
    expect(
      screen.getByRole("button", { name: /Навигация по теме/i })
    ).toBeInTheDocument();
    // Постоянного списка уроков (<ul> со всеми уроками темы) в сайдбаре больше нет
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(document.querySelector(".lesson-aside-lessons")).not.toBeInTheDocument();
  });

  it("открывает TopicLessonsModal при клике на кнопку", () => {
    renderSidebar();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Навигация по теме/i }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // В модалке — список уроков темы
    expect(within(dialog).getByText("Введение в HTML")).toBeInTheDocument();
    expect(within(dialog).getByText("Основные теги")).toBeInTheDocument();
  });

  it("закрывает модалку по клику на кнопку закрытия", () => {
    renderSidebar();
    fireEvent.click(screen.getByRole("button", { name: /Навигация по теме/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("выделяет активный урок внутри модалки", () => {
    renderSidebar(lessonRef1.id);
    fireEvent.click(screen.getByRole("button", { name: /Навигация по теме/i }));

    const activeRow = document.querySelector(".topic-lessons-row.is-active");
    expect(activeRow).toBeInTheDocument();
    expect(activeRow).toHaveTextContent("Введение в HTML");
  });
});
