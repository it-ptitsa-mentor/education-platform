import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { flattenLessons, isUnitDone, type Course } from "../../course";
import type { CheckResult, ExerciseDetail } from "../../exercise-types";
import { LessonContext, type LessonContextValue } from "../lesson-context";
import { LessonExerciseStep } from "../LessonExerciseStep";

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

const allLessons = flattenLessons(course);

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

const refreshProgress = vi.fn();

const renderStep = (lessonPos: number) => {
  const current = allLessons[lessonPos]!;
  const ctx: LessonContextValue = {
    course,
    module: current.module,
    topic: current.topic,
    current,
    topicLessons: allLessons,
    allLessons,
    prev: allLessons[lessonPos - 1] ?? null,
    next: allLessons[lessonPos + 1] ?? null,
    progressVersion: 0,
    refreshProgress,
  };
  return {
    current,
    ...render(
      <MemoryRouter>
        <LessonContext.Provider value={ctx}>
          <LessonExerciseStep />
        </LessonContext.Provider>
      </MemoryRouter>,
    ),
  };
};

const runTests = async () => {
  fireEvent.click(await screen.findByRole("button", { name: /RUN TESTS/ }));
  await vi.waitFor(() => expect(api.checkExercise).toHaveBeenCalledTimes(1));
};

const headerContinue = () =>
  document.querySelector<HTMLAnchorElement>(".readme-panel-actions .exercise-continue-btn");
const mobileContinue = () =>
  document.querySelector<HTMLAnchorElement>(".workspace-mobile-bar .workspace-mobile-continue-btn");
const dialog = () => document.querySelector(".modal, [role='dialog']");

describe("LessonExerciseStep — «Далее» как на standalone, без модалки", () => {
  beforeEach(() => {
    localStorage.clear();
    refreshProgress.mockReset();
    api.fetchExercise.mockReset();
    api.checkExercise.mockReset();
    api.fetchExercise.mockImplementation(async (slug: string) => exercise(slug));
  });

  it("до PASS «Далее» видна рядом с RUN TESTS: серая, ведёт на следующий шаг", async () => {
    renderStep(0);
    const run = await screen.findByRole("button", { name: /RUN TESTS/ });
    const link = headerContinue()!;
    expect(link).not.toBeNull();
    expect(link.closest(".readme-panel-actions")).toBe(run.closest(".readme-panel-actions"));
    expect(link.textContent).toBe("Далее →");
    expect(link.getAttribute("aria-label")).toBe("Далее: Блочная модель →");
    expect(link.getAttribute("href")).toBe("/learn/m/t/2/theory");
    expect(link.className).toContain("btn-secondary");
    expect(mobileContinue()!.className).toContain("btn-secondary");
  });

  it("после PASS: «Далее» золотая, модалки нет, прогресс записан", async () => {
    api.checkExercise.mockResolvedValue(checkResult(true));
    const { current } = renderStep(0);
    await runTests();

    await vi.waitFor(() => expect(headerContinue()!.className).toContain("btn-primary"));
    expect(mobileContinue()!.className).toContain("btn-primary");
    expect(mobileContinue()!.getAttribute("href")).toBe("/learn/m/t/2/theory");
    expect(dialog()).toBeNull();
    expect(isUnitDone(current.id, "exercise")).toBe(true);
    expect(refreshProgress).toHaveBeenCalledTimes(1);
  });

  it("после FAIL «Далее» серая, прогресс не записан", async () => {
    api.checkExercise.mockResolvedValue(checkResult(false));
    const { current } = renderStep(0);
    await runTests();
    await screen.findByRole("button", { name: /RUN TESTS/ });

    expect(headerContinue()!.className).toContain("btn-secondary");
    expect(isUnitDone(current.id, "exercise")).toBe(false);
    expect(refreshProgress).not.toHaveBeenCalled();
  });

  it("последний урок: кнопки «Далее» нет, PASS всё равно пишет прогресс", async () => {
    api.checkExercise.mockResolvedValue(checkResult(true));
    const { current } = renderStep(2);
    await runTests();

    await vi.waitFor(() => expect(isUnitDone(current.id, "exercise")).toBe(true));
    expect(screen.queryByRole("link", { name: /Далее/ })).toBeNull();
    expect(dialog()).toBeNull();
  });

  it("без автопроверки: «Я справился» золотит «Далее» и пишет прогресс", async () => {
    api.fetchExercise.mockImplementation(async (slug: string) => exercise(slug, "stub"));
    const { current } = renderStep(0);
    const [selfCheck] = await screen.findAllByRole("button", { name: /Я СПРАВИЛСЯ/ });
    expect(headerContinue()!.className).toContain("btn-secondary");
    fireEvent.click(selfCheck!);

    await vi.waitFor(() => expect(headerContinue()!.className).toContain("btn-primary"));
    expect(isUnitDone(current.id, "exercise")).toBe(true);
    expect(dialog()).toBeNull();
  });
});
