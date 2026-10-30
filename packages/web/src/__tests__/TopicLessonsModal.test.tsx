import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
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
  document.documentElement.style.overflow = "";
  document.body.classList.remove("modal-open");
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

  it("вешает modal-open на body — блокирует реальный скролл-контейнер .app-main, снимает при размонтировании", () => {
    // .app-main — фактический скролл-контейнер страницы (overflow-y: auto),
    // html/body сами по себе не скроллятся (.app-shell{overflow:hidden}).
    // Без класса modal-open фон продолжал бы скроллиться под модалкой.
    const onClose = vi.fn();
    const { unmount } = renderModal(onClose);
    expect(document.body.classList.contains("modal-open")).toBe(true);
    unmount();
    expect(document.body.classList.contains("modal-open")).toBe(false);
  });

  it("не снимает блокировку, пока открыта ещё одна модалка (счётчик, без залипания)", () => {
    const onClose1 = vi.fn();
    const onClose2 = vi.fn();
    const first = renderModal(onClose1);
    const second = renderModal(onClose2);

    expect(document.body.classList.contains("modal-open")).toBe(true);

    first.unmount();
    // первая модалка закрылась — вторая всё ещё открыта, фон должен
    // оставаться заблокированным
    expect(document.body.classList.contains("modal-open")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    second.unmount();
    // закрылась последняя — блокировка снята
    expect(document.body.classList.contains("modal-open")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("не восстанавливает скролл раньше времени при быстром перемонтировании (Strict Mode-подобный сценарий)", () => {
    const onClose = vi.fn();
    const { unmount: unmountA } = renderModal(onClose);
    const { unmount: unmountB } = renderModal(onClose);
    unmountA();
    expect(document.body.classList.contains("modal-open")).toBe(true);
    unmountB();
    expect(document.body.classList.contains("modal-open")).toBe(false);
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

  describe("кликабельная строка", () => {
    const LocationProbe = () => {
      const { pathname } = useLocation();
      return <div data-testid="location">{pathname}</div>;
    };

    const renderRouted = (onClose = vi.fn()) =>
      render(
        <MemoryRouter initialEntries={["/start"]}>
          <Routes>
            <Route
              path="*"
              element={
                <>
                  <TopicLessonsModal module={mockModule} topic={mockTopic} onClose={onClose} />
                  <LocationProbe />
                </>
              }
            />
          </Routes>
        </MemoryRouter>,
      );

    it("клик по ячейке строки (не по ссылке) ведёт на теорию урока и закрывает модалку", () => {
      const onClose = vi.fn();
      renderRouted(onClose);
      const row = screen.getByText("Второй урок").closest("tr")!;
      fireEvent.click(row.querySelector(".topic-lessons-td--num")!);
      expect(screen.getByTestId("location")).toHaveTextContent("/learn/html-basics/tags/2/theory");
      expect(onClose).toHaveBeenCalled();
    });

    it("клик по точке «Тест» ведёт на квиз, строка не перебивает переход на теорию", () => {
      renderRouted();
      fireEvent.click(screen.getByLabelText(/Второй урок: открыть тест/));
      expect(screen.getByTestId("location")).toHaveTextContent("/learn/html-basics/tags/2/quiz");
    });
  });
});
