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

const toolbarContinue = () =>
  document.querySelector<HTMLAnchorElement>(".exercise-toolbar .exercise-continue-btn");
const mobileContinue = () =>
  document.querySelector<HTMLAnchorElement>(".workspace-mobile-bar .workspace-mobile-continue-btn");

describe("ExercisePage — «Далее» и раскладка кнопок", () => {
  beforeEach(() => {
    localStorage.clear();
    api.fetchExercise.mockReset();
    api.checkExercise.mockReset();
    courseApi.loadCourse.mockReset();
    courseApi.loadCourse.mockResolvedValue(course);
    api.fetchExercise.mockImplementation(async (slug: string) => exercise(slug));
  });

  it("RUN TESTS стоит над панелью BRIEF, а не в шапке", async () => {
    renderPage("ex-first");
    const run = await screen.findByRole("button", { name: /RUN TESTS/ });
    expect(run.closest(".exercise-toolbar")).toBeNull();
    const actions = run.closest(".readme-panel-actions--top");
    expect(actions).not.toBeNull();
    // блок действий идёт раньше заголовка BRIEF и условия
    const panel = actions!.closest(".readme-panel")!;
    expect(panel.firstElementChild?.nextElementSibling).toBe(actions);
  });

  it("до PASS «Далее» уже видна: серая, но ведёт на следующий урок", async () => {
    renderPage("ex-first");
    await screen.findByRole("button", { name: /RUN TESTS/ });
    const link = await vi.waitFor(() => {
      const el = toolbarContinue();
      expect(el).not.toBeNull();
      return el!;
    });
    expect(link.textContent).toBe("Далее: Блочная модель →");
    expect(link.getAttribute("href")).toBe("/learn/m/t/2/theory");
    expect(link.className).toContain("btn-secondary");
    expect(link.className).not.toContain("btn-primary");
  });

  it("после PASS «Далее» становится primary", async () => {
    api.checkExercise.mockResolvedValue(checkResult(true));
    renderPage("ex-first");
    await runTests();

    await vi.waitFor(() => expect(toolbarContinue()?.className).toContain("btn-primary"));
    expect(toolbarContinue()!.getAttribute("href")).toBe("/learn/m/t/2/theory");
    expect(mobileContinue()!.className).toContain("btn-primary");
    expect(document.querySelector(".modal, [role='dialog']")).toBeNull();
  });

  it("после FAIL «Далее» остаётся secondary", async () => {
    api.checkExercise.mockResolvedValue(checkResult(false));
    renderPage("ex-first");
    await runTests();
    await vi.waitFor(() => expect(api.checkExercise).toHaveBeenCalledTimes(1));
    expect(toolbarContinue()!.className).toContain("btn-secondary");
    expect(mobileContinue()!.className).toContain("btn-secondary");
  });

  it("мобилка: компактная «Далее →» в нижнем фикс-баре, полный текст в aria-label", async () => {
    renderPage("ex-first");
    await screen.findByRole("button", { name: /RUN TESTS/ });
    const link = await vi.waitFor(() => {
      const el = mobileContinue();
      expect(el).not.toBeNull();
      return el!;
    });
    expect(link.textContent).toBe("Далее →");
    expect(link.getAttribute("aria-label")).toBe("Далее: Блочная модель →");
    expect(link.getAttribute("href")).toBe("/learn/m/t/2/theory");
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

  it("задание без автопроверки: «Я справился» над BRIEF, «Далее» золотеет после клика", async () => {
    api.fetchExercise.mockImplementation(async (slug: string) => exercise(slug, "stub"));
    renderPage("ex-first");
    // «Я справился» есть и над BRIEF, и в панели вывода — жмём верхнюю.
    const [selfCheck] = await screen.findAllByRole("button", { name: /Я СПРАВИЛСЯ/ });
    expect(selfCheck!.closest(".readme-panel-actions--top")).not.toBeNull();
    await vi.waitFor(() => expect(toolbarContinue()?.className).toContain("btn-secondary"));
    fireEvent.click(selfCheck!);

    await vi.waitFor(() => expect(toolbarContinue()?.className).toContain("btn-primary"));
    expect(toolbarContinue()!.getAttribute("href")).toBe("/learn/m/t/2/theory");
  });
});
