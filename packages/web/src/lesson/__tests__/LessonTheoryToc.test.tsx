import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LessonTheoryToc } from "../LessonTheoryToc";
import type { HeadingItem } from "../../lib/theory-headings";

const twoHeadings: HeadingItem[] = [
  { id: "css-selektory", text: "CSS-селекторы" },
  { id: "klassy-i-identifikatory", text: "Классы и идентификаторы" },
];

const manyHeadings: HeadingItem[] = [
  { id: "stili-css", text: "Стили CSS" },
  { id: "podklyuchenie-css", text: "Подключение CSS" },
  { id: "klassy-i-identifikatory", text: "Классы и идентификаторы" },
  { id: "selektory", text: "Селекторы" },
  { id: "samostoyatelnaya-rabota", text: "Самостоятельная работа" },
];

describe("LessonTheoryToc", () => {
  it("не рендерится, если заголовков меньше 2", () => {
    const { container } = render(<LessonTheoryToc headings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("не рендерится при одном заголовке", () => {
    const { container } = render(
      <LessonTheoryToc headings={[{ id: "intro", text: "Введение" }]} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("рендерит nav при 2+ заголовках", () => {
    render(<LessonTheoryToc headings={twoHeadings} />);
    expect(screen.getByRole("navigation", { name: /содержание урока/i })).toBeInTheDocument();
  });

  it("рендерит все переданные заголовки как ссылки", () => {
    render(<LessonTheoryToc headings={manyHeadings} />);
    expect(screen.getByRole("link", { name: "Стили CSS" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Классы и идентификаторы" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Самостоятельная работа" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(manyHeadings.length);
  });

  it("у каждой ссылки href = #id заголовка", () => {
    render(<LessonTheoryToc headings={twoHeadings} />);
    expect(
      screen.getByRole("link", { name: "CSS-селекторы" })
    ).toHaveAttribute("href", "#css-selektory");
    expect(
      screen.getByRole("link", { name: "Классы и идентификаторы" })
    ).toHaveAttribute("href", "#klassy-i-identifikatory");
  });

  it("клик по ссылке скроллит к элементу с якорным id", () => {
    const mockEl = { scrollIntoView: vi.fn() };
    vi.spyOn(document, "getElementById").mockReturnValue(mockEl as unknown as HTMLElement);

    render(<LessonTheoryToc headings={twoHeadings} />);
    const link = screen.getByRole("link", { name: "CSS-селекторы" });
    fireEvent.click(link);

    expect(document.getElementById).toHaveBeenCalledWith("css-selektory");
    expect(mockEl.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });

    vi.restoreAllMocks();
  });

  it("рендерит заголовок «Содержание»", () => {
    render(<LessonTheoryToc headings={twoHeadings} />);
    expect(screen.getByText(/содержание/i)).toBeInTheDocument();
  });

  it("ссылки имеют класс lesson-theory-toc-link", () => {
    render(<LessonTheoryToc headings={twoHeadings} />);
    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link).toHaveClass("lesson-theory-toc-link");
    }
  });
});
