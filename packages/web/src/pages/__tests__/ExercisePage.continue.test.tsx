import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Course } from "../../course";
import type { CheckResult, ExerciseDetail } from "../../exercise-types";
import { ExercisePage } from "../ExercisePage";

vi.mock("@monaco-editor/react", () => ({
  default: () => <div data-testid="editor" />,
}));
vi.mock("../../lib/monaco-setup", () => ({
  setupMonaco: () => undefined,
  bindJsxSyntaxHighlight: () => () => undefined,
}));

const api = vi.hoisted(() => ({
  fetchExercise: vi.fn(),
  checkExercise: vi.fn(),
}));
vi.mock("../../api", () => api);

const courseApi = vi.hoisted(() => ({ loadCourse: vi.fn() }));
vi.mock("../../course", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../course")>()),
  loadCourse: courseApi.loadCourse,
}));

const lesson = (index: number, title: string, exercise: string | null) => ({
  index,
  title,
  theory: `content/theory/m/t/${index}.md`,
  quiz: null,
  exercise,
});

const course: Course = {
  course: "c",
  course_id: "c",
  modules: [
    {
      index: 1,
      title: "Модуль",
      slug: "m",
      topics: [
        {
          index: 1,
          title: "Тема",
          slug: "t",
          course_slug: null,
          lessons: [
            lesson(1, "Первый урок", "ex-first"),
            lesson(2, "Блочная модель", null),
            lesson(3, "Последний урок", "ex-last"),
          ],
        },
      ],
    },
  ],
};

const exercise = (slug: string, testClass?: ExerciseDetail["testClass"]): ExerciseDetail => ({
  slug,
  title: `Задание ${slug}`,
  language: "javascript",
  filesToOpen: ["index.js"],
  readme: "",
  files: { "index.js": "" },
  testClass,
});

const checkResult = (passed: boolean): CheckResult => ({
  passed,
  exitCode: passed ? 0 : 1,
  stdout: "",
  stderr: "",
});

const renderPage = (slug: string) =>
  render(
    <MemoryRouter initialEntries={[`/exercise/${slug}`]}>
      <Routes>
        <Route path="/exercise/:slug" element={<ExercisePage />} />
      </Routes>
    </MemoryRouter>,
  );

const runTests = async () => {
  fireEvent.click(await screen.findByRole("button", { name: /RUN TESTS/ }));
  await screen.findByRole("button", { name: /RUN TESTS/ });
};

describe("ExercisePage — «Далее» после PASS", () => {
  beforeEach(() => {
    localStorage.clear();
    api.fetchExercise.mockReset();
    api.checkExercise.mockReset();
    courseApi.loadCourse.mockReset();
    courseApi.loadCourse.mockResolvedValue(course);
    api.fetchExercise.mockImplementation(async (slug: string) => exercise(slug));
  });

  it("до запуска тестов кнопки нет", async () => {
    renderPage("ex-first");
    await screen.findByRole("button", { name: /RUN TESTS/ });
    expect(screen.queryByRole("link", { name: /Далее/ })).toBeNull();
  });

  it("после PASS показывает ссылку на следующий урок рядом с RUN TESTS", async () => {
    api.checkExercise.mockResolvedValue(checkResult(true));
    renderPage("ex-first");
    await runTests();

    const link = await screen.findByRole("link", { name: "Далее: Блочная модель →" });
    expect(link.getAttribute("href")).toBe("/learn/m/t/2/theory");
    expect(link.className).toContain("btn-primary");
    expect(link.closest(".exercise-toolbar")).not.toBeNull();
    expect(document.querySelector(".modal, [role='dialog']")).toBeNull();
  });

  it("после FAIL кнопки нет", async () => {
    api.checkExercise.mockResolvedValue(checkResult(false));
    renderPage("ex-first");
    await runTests();
    await vi.waitFor(() => expect(api.checkExercise).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("link", { name: /Далее/ })).toBeNull();
  });

  it("у последнего урока следующего шага нет — кнопки нет и после PASS", async () => {
    api.checkExercise.mockResolvedValue(checkResult(true));
    renderPage("ex-last");
    await runTests();
    await vi.waitFor(() => expect(api.checkExercise).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("link", { name: /Далее/ })).toBeNull();
  });

  it("упражнение вне курса: PASS работает, кнопки нет", async () => {
    api.checkExercise.mockResolvedValue(checkResult(true));
    renderPage("ex-orphan");
    await runTests();
    await vi.waitFor(() => expect(api.checkExercise).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("link", { name: /Далее/ })).toBeNull();
  });

  it("курс не загрузился: упражнение работает, кнопки нет", async () => {
    courseApi.loadCourse.mockRejectedValue(new Error("offline"));
    api.checkExercise.mockResolvedValue(checkResult(true));
    renderPage("ex-first");
    await runTests();
    await vi.waitFor(() => expect(api.checkExercise).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("link", { name: /Далее/ })).toBeNull();
  });

  it("задание без автопроверки: кнопка появляется после «Я справился»", async () => {
    api.fetchExercise.mockImplementation(async (slug: string) => exercise(slug, "stub"));
    renderPage("ex-first");
    // «Я справился» есть и в тулбаре, и в панели вывода — жмём тулбарную.
    const [selfCheck] = await screen.findAllByRole("button", { name: /Я СПРАВИЛСЯ/ });
    fireEvent.click(selfCheck!);

    const link = await screen.findByRole("link", { name: "Далее: Блочная модель →" });
    expect(link.getAttribute("href")).toBe("/learn/m/t/2/theory");
  });
});
