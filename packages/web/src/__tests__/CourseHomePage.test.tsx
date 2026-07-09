import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CourseHomePage } from "../pages/CourseHomePage";
import type { RoadmapCatalog } from "../roadmap";

// Мокаем модуль roadmap, чтобы не делать реальные fetch-запросы
vi.mock("../roadmap", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../roadmap")>();
  return {
    ...actual,
    loadRoadmapCatalog: vi.fn(),
  };
});

// Мокаем getCurrentTrack — единственную точку трека
vi.mock("../track", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../track")>();
  return {
    ...actual,
    getCurrentTrack: vi.fn().mockReturnValue("frontend"),
  };
});

import { loadRoadmapCatalog } from "../roadmap";
import { getCurrentTrack } from "../track";

const mockCatalog: RoadmapCatalog = {
  professions: [
    {
      id: "frontend",
      title: "JS-разработчик",
      description: "JavaScript и веб: основы языка, DOM, React.",
      roadmaps: [
        {
          id: "frontend-bootcamp",
          title: "Frontend Bootcamp",
          subtitle: "16 нед · JS → React",
          status: "active",
          badge: "16 нед",
        },
      ],
    },
    {
      id: "go",
      title: "Go-разработчик",
      description: "Бэкенд на Go.",
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
  vi.mocked(getCurrentTrack).mockReturnValue("frontend");
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("CourseHomePage — трек frontend (по умолчанию)", () => {
  it("показывает спиннер загрузки до получения данных", () => {
    vi.mocked(loadRoadmapCatalog).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText("ЗАГРУЗКА")).toBeInTheDocument();
  });

  it("рендерит только профессию текущего трека", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("JS-разработчик")).toBeInTheDocument();
    });
    // Go-профессия не должна отображаться
    expect(screen.queryByText("Go-разработчик")).not.toBeInTheDocument();
  });

  it("показывает описание текущей профессии", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/JavaScript и веб/)).toBeInTheDocument();
    });
  });

  it("рендерит роадмап активной профессии как ссылку", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Frontend Bootcamp")).toBeInTheDocument();
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

describe("CourseHomePage — трек go", () => {
  it("показывает только Go-профессию, без frontend-карточек", async () => {
    vi.mocked(getCurrentTrack).mockReturnValue("go");
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Go-разработчик")).toBeInTheDocument();
    });
    expect(screen.queryByText("JS-разработчик")).not.toBeInTheDocument();
    expect(screen.queryByText("Frontend Bootcamp")).not.toBeInTheDocument();
  });

  it("показывает сообщение о разработке программы, если роадмапов нет", async () => {
    vi.mocked(getCurrentTrack).mockReturnValue("go");
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Программа в разработке/)).toBeInTheDocument();
    });
  });
});

describe("CourseHomePage — неизвестный трек", () => {
  it("показывает заглушку если профессия не найдена", async () => {
    // Форсируем трек, которого нет в каталоге
    vi.mocked(getCurrentTrack).mockReturnValue("go");
    vi.mocked(loadRoadmapCatalog).mockResolvedValue({
      professions: [{ id: "frontend", title: "Frontend", roadmaps: [] }],
    });
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Программа в разработке/)).toBeInTheDocument();
    });
    expect(screen.queryByText("Frontend")).not.toBeInTheDocument();
  });
});
