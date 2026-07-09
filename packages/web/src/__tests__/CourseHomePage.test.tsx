import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CourseHomePage } from "../pages/CourseHomePage";
import type { RoadmapCatalog } from "../roadmap";

// Мокаем модуль roadmap, чтобы не делать реальные fetch-запросы
// и не зависеть от модульного кеша
vi.mock("../roadmap", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../roadmap")>();
  return {
    ...actual,
    loadRoadmapCatalog: vi.fn(),
  };
});

import { loadRoadmapCatalog } from "../roadmap";

const mockCatalog: RoadmapCatalog = {
  professions: [
    {
      id: "js",
      title: "JavaScript-разработчик",
      description: "Frontend и Node.js",
      roadmaps: [
        { id: "js-frontend", title: "Frontend-разработчик", subtitle: "React", status: "active" },
      ],
    },
    {
      id: "go",
      title: "Go-разработчик",
      description: "Backend на Go",
      status: "soon",
      roadmaps: [],
    },
  ],
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <CourseHomePage />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.mocked(loadRoadmapCatalog).mockResolvedValue(mockCatalog);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("CourseHomePage", () => {
  it("показывает спиннер загрузки до получения данных", () => {
    // Возвращаем Promise, который никогда не resolves во время проверки
    vi.mocked(loadRoadmapCatalog).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText("ЗАГРУЗКА")).toBeInTheDocument();
  });

  it("рендерит профессии после загрузки", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("JavaScript-разработчик")).toBeInTheDocument();
    });
    expect(screen.getByText("Go-разработчик")).toBeInTheDocument();
    expect(screen.getByText("Frontend и Node.js")).toBeInTheDocument();
  });

  it("рендерит профессию со статусом «soon» без ссылки", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Go-разработчик")).toBeInTheDocument();
    });
    const soonCard = document.querySelector(".roadmaps-card--soon");
    expect(soonCard).toBeInTheDocument();
  });

  it("рендерит активные профессии как ссылки", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("JavaScript-разработчик")).toBeInTheDocument();
    });
    const activeCard = document.querySelector(".roadmaps-card--active");
    expect(activeCard).toBeInTheDocument();
  });

  it("показывает ошибку при неудаче загрузки", async () => {
    vi.mocked(loadRoadmapCatalog).mockRejectedValue(new Error("Сеть недоступна"));
    renderPage();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText(/Сеть недоступна/)).toBeInTheDocument();
  });
});
