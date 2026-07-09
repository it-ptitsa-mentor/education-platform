import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TopicLessonsModal } from "../components/TopicLessonsModal";
import type { Module, Topic } from "../course";

const mockModule: Module = {
  index: 1,
  title: "Основы HTML",
  slug: "html-basics",
  topics: [],
};

const mockTopic: Topic = {
  index: 1,
  title: "Теги и атрибуты",
  slug: "tags",
  course_slug: null,
  lessons: [
    {
      index: 1,
      title: "Первый урок",
      theory: "content/theory/html-basics/tags/1.md",
      quiz: null,
      exercise: null,
    },
    {
      index: 2,
      title: "Второй урок",
      theory: "content/theory/html-basics/tags/2.md",
      quiz: "quiz-1",
      exercise: "ex-1",
    },
  ],
};

const renderModal = (onClose = vi.fn()) =>
  render(
    <MemoryRouter>
      <TopicLessonsModal module={mockModule} topic={mockTopic} onClose={onClose} />
    </MemoryRouter>
  );

afterEach(() => {
  // Ensure scroll lock is cleared between tests
  document.body.style.overflow = "";
});

describe("TopicLessonsModal", () => {
  it("рендерит диалог с заголовком и списком уроков", () => {
    renderModal();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Теги и атрибуты")).toBeInTheDocument();
    expect(screen.getByText("Основы HTML")).toBeInTheDocument();
    expect(screen.getByText("Первый урок")).toBeInTheDocument();
    expect(screen.getByText("Второй урок")).toBeInTheDocument();
  });

  it("вызывает onClose при нажатии Escape", () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("вызывает onClose при клике на оверлей", () => {
    const onClose = vi.fn();
    renderModal(onClose);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const overlay = document.querySelector(".course-modal")!;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("НЕ вызывает onClose при клике внутри панели", () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("блокирует прокрутку при монтировании, восстанавливает при размонтировании", () => {
    const onClose = vi.fn();
    const { unmount } = renderModal(onClose);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("вызывает onClose при нажатии кнопки закрытия", () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("выделяет активный урок", () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <TopicLessonsModal
          module={mockModule}
          topic={mockTopic}
          activeLessonId="html-basics/tags/1"
          onClose={onClose}
        />
      </MemoryRouter>
    );
    const activeRow = document.querySelector(".topic-lessons-row.is-active");
    expect(activeRow).toBeInTheDocument();
  });
});
