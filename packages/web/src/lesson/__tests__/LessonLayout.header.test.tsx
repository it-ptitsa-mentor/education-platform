import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Course } from "../../course";
import { markUnitDone } from "../../course";
import { useLesson } from "../lesson-context";
import { LessonLayout } from "../LessonLayout";

const course: Course = {
  course: "Frontend",
  course_id: "frontend",
  modules: [
    {
      index: 1,
      title: "HTML",
      slug: "html",
      topics: [
        {
          index: 1,
          title: "Тема",
          slug: "intro",
          course_slug: null,
          lessons: [
            { index: 1, title: "Урок с практикой", theory: "t1.md", quiz: "q1", exercise: "ex1" },
            { index: 2, title: "Урок только с квизом", theory: "t2.md", quiz: "q2", exercise: null },
            { index: 3, title: "Последний", theory: "t3.md", quiz: "q3", exercise: null },
          ],
        },
      ],
    },
  ],
};

vi.mock("../../course", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../course")>()),
  loadCourse: () => Promise.resolve(course),
}));
vi.mock("../LessonCourseSidebar", () => ({ LessonCourseSidebar: () => null }));

// Шаг-заглушка: «проходит» квиз так же, как LessonQuizStep.
const QuizStub = () => {
  const { current, refreshProgress } = useLesson();
  return (
    <button
      type="button"
      onClick={() => {
        markUnitDone(current.id, "quiz");
        refreshProgress();
      }}
    >
      пройти квиз
    </button>
  );
};

const renderAt = async (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="learn/:moduleSlug/:topicSlug/:lessonIndex" element={<LessonLayout />}>
          <Route path="theory" element={<div>теория</div>} />
          <Route path="quiz" element={<QuizStub />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
  await act(async () => {});
};

// jsdom не реализует scrollTo, а LessonLayout скроллит наверх при смене шага.
beforeAll(() => {
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

const continueLink = () => screen.queryByRole("link", { name: /Далее/ });

describe("LessonLayout — «Далее» в хедере после квиза", () => {
  beforeEach(() => localStorage.clear());

  it("квиз не пройден — кнопки нет", async () => {
    await renderAt("/learn/html/intro/1/quiz");
    expect(continueLink()).not.toBeInTheDocument();
  });

  it("после onPassed кнопка появляется без перезагрузки и ведёт на практику урока", async () => {
    await renderAt("/learn/html/intro/1/quiz");
    fireEvent.click(screen.getByText("пройти квиз"));
    expect(continueLink()).toHaveAttribute("href", "/learn/html/intro/1/exercise");
  });

  it("квиз пройден раньше, урок без практики — «Далее: <следующий урок> →» сразу", async () => {
    markUnitDone("html/intro/2", "quiz");
    await renderAt("/learn/html/intro/2/quiz");
    expect(continueLink()).toHaveAttribute("href", "/learn/html/intro/3/theory");
    expect(continueLink()).toHaveTextContent("Далее: Последний →");
  });

  it("последний урок без практики — кнопки нет", async () => {
    markUnitDone("html/intro/3", "quiz");
    await renderAt("/learn/html/intro/3/quiz");
    expect(continueLink()).not.toBeInTheDocument();
  });

  it("на теории кнопки нет, даже если квиз урока пройден", async () => {
    markUnitDone("html/intro/1", "quiz");
    await renderAt("/learn/html/intro/1/theory");
    expect(continueLink()).not.toBeInTheDocument();
  });
});

describe("LessonLayout — кнопка шторки «Уроки»", () => {
  it("бургер-иконка вместо слова, доступное имя «Уроки» сохранено", async () => {
    await renderAt("/learn/html/intro/1/theory");
    const toggle = screen.getByRole("button", { name: "Уроки" });
    expect(toggle).not.toHaveTextContent("Уроки");
    expect(toggle.querySelector("svg")).not.toBeNull();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
  });
});
