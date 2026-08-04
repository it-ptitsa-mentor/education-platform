import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RoadmapPage } from "../pages/RoadmapPage";
import type { Course } from "../course";
import type { Roadmap, RoadmapCatalog } from "../roadmap";

vi.mock("../roadmap", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../roadmap")>();
  return {
    ...actual,
    loadRoadmapCatalog: vi.fn(),
    loadRoadmap: vi.fn(),
  };
});

vi.mock("../course", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../course")>();
  return {
    ...actual,
    loadCourse: vi.fn(),
  };
});

import { loadRoadmapCatalog, loadRoadmap } from "../roadmap";
import { loadCourse } from "../course";

const mockCourse: Course = {
  course: "Frontend",
  course_id: "frontend",
  modules: [
    {
      index: 1,
      title: "Основы HTML",
      slug: "html",
      topics: [
        {
          index: 1,
          title: "Введение",
          slug: "intro",
          course_slug: null,
          lessons: [
            {
              index: 1,
              title: "Урок 1",
              theory: "content/theory/html/intro/1.md",
              quiz: null,
              exercise: null,
            },
          ],
        },
        {
          index: 2,
          title: "Теги",
          slug: "tags",
          course_slug: null,
          lessons: [
            {
              index: 1,
              title: "Теги и атрибуты",
              theory: "content/theory/html/tags/1.md",
              quiz: null,
              exercise: null,
            },
          ],
        },
      ],
    },
  ],
};

const mockRoadmap: Roadmap = {
  id: "js-frontend",
  title: "Frontend-разработчик",
  subtitle: "React + TypeScript",
  profession: "JavaScript-разработчик",
  phases: [],
  nodes: {
    "project-1": {
      kind: "project",
      label: "HTML-Landing",
      description: "Дедлайн: конец недели 1. Верстка лендинга по макету.",
      links: [],
      classroomUrl: "https://classroom.github.com/a/test123",
      moduleSlug: "html",
      courseTopic: null,
    },
  },
};

const mockCatalog: RoadmapCatalog = {
  professions: [
    {
      id: "js",
      title: "JavaScript-разработчик",
      roadmaps: [
        { id: "js-frontend", title: "Frontend-разработчик", subtitle: "React", status: "active" },
      ],
    },
  ],
};

const renderPage = (roadmapId = "js-frontend") =>
  render(
    <MemoryRouter initialEntries={[`/roadmaps/${roadmapId}`]}>
      <Routes>
        <Route path="/roadmaps/:roadmapId" element={<RoadmapPage />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.mocked(loadRoadmapCatalog).mockResolvedValue(mockCatalog);
  vi.mocked(loadRoadmap).mockResolvedValue(mockRoadmap);
  vi.mocked(loadCourse).mockResolvedValue(mockCourse);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("RoadmapPage", () => {
  it("показывает спиннер загрузки до получения данных", () => {
    vi.mocked(loadRoadmapCatalog).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText("ЗАГРУЗКА")).toBeInTheDocument();
  });

  it("рендерит модули курса после загрузки", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Программа обучения/)).toBeInTheDocument();
    });
    // Топики из mockCourse
    expect(screen.getByText("Введение")).toBeInTheDocument();
    expect(screen.getByText("Теги")).toBeInTheDocument();
  });

  it("открывает TopicLessonsModal при клике на тему", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Введение")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Введение"));
    // Модальное окно открылось — есть диалог
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("закрывает модальное окно при нажатии Escape", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Введение")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Введение"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("показывает ошибку при неудаче загрузки каталога", async () => {
    vi.mocked(loadRoadmapCatalog).mockRejectedValue(new Error("Ошибка сети"));
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText(/Ошибка сети/)).toBeInTheDocument();
  });

  it("показывает карточку проекта в конце модуля со ссылкой на Classroom", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Введение")).toBeInTheDocument();
    });

    expect(screen.getByText("Проект модуля")).toBeInTheDocument();
    expect(screen.getByText("HTML-Landing")).toBeInTheDocument();

    const classroomLink = screen.getByRole("link", { name: /Открыть в Classroom/i });
    expect(classroomLink).toHaveAttribute(
      "href",
      "https://classroom.github.com/a/test123",
    );
    expect(classroomLink).toHaveAttribute("target", "_blank");

    // Карточка проекта идёт ПОСЛЕ тем модуля в DOM-порядке.
    const moduleBlock = classroomLink.closest(".course-module-block");
    expect(moduleBlock).not.toBeNull();
    const topicButtons = moduleBlock!.querySelectorAll(".course-topic-btn");
    const projectsBlock = moduleBlock!.querySelector(".course-module-projects");
    expect(topicButtons.length).toBeGreaterThan(0);
    expect(projectsBlock).not.toBeNull();
    const topicsGrid = moduleBlock!.querySelector(".course-module-topics-grid")!;
    expect(
      topicsGrid.compareDocumentPosition(projectsBlock!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("показывает «Скоро» для роадмапа со статусом soon", async () => {
    const soonCatalog: RoadmapCatalog = {
      professions: [
        {
          id: "go",
          title: "Go",
          roadmaps: [
            { id: "go-backend", title: "Go Backend", subtitle: "Go + PostgreSQL", status: "soon" },
          ],
        },
      ],
    };
    vi.mocked(loadRoadmapCatalog).mockResolvedValue(soonCatalog);
    renderPage("go-backend");
    await waitFor(() => {
      expect(screen.getByText(/скоро появится на платформе/i)).toBeInTheDocument();
    });
  });
});
