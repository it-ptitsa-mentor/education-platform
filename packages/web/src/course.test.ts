import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Lesson } from "./course";
import {
  isLessonComplete,
  isUnitDone,
  markUnitDone,
  readLessonUnits,
  sanitizeTheoryBody,
} from "./course";

const PKEY = "ptitsa-course-progress";

const lesson = (overrides: Partial<Lesson> = {}): Lesson => ({
  index: 1,
  title: "L",
  theory: "t.md",
  quiz: "q",
  exercise: "e",
  ...overrides,
});

describe("lesson unit progress", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("tracks units independently", () => {
    markUnitDone("m/t/1", "theory");
    expect(isUnitDone("m/t/1", "theory")).toBe(true);
    expect(isUnitDone("m/t/1", "quiz")).toBe(false);
    expect(readLessonUnits("m/t/1")).toEqual({ theory: true });
  });

  it("lesson complete only when all available units done", () => {
    const id = "m/t/1";
    const full = lesson();
    markUnitDone(id, "theory");
    expect(isLessonComplete(full, id)).toBe(false);
    markUnitDone(id, "quiz");
    markUnitDone(id, "exercise");
    expect(isLessonComplete(full, id)).toBe(true);
  });

  it("skips missing quiz/exercise for completion", () => {
    const id = "m/t/2";
    const theoryOnly = lesson({ quiz: null, exercise: null });
    markUnitDone(id, "theory");
    expect(isLessonComplete(theoryOnly, id)).toBe(true);
  });

  it("migrates legacy boolean progress", () => {
    localStorage.setItem(PKEY, JSON.stringify({ "m/t/0": true }));
    expect(readLessonUnits("m/t/0")).toEqual({
      theory: true,
      quiz: true,
      exercise: true,
    });
  });
});

describe("sanitizeTheoryBody", () => {
  it("separates IMG placeholder from immediately-following text (no blank line)", () => {
    // Воспроизводит баг: IMG-комментарий стоит на своей строке, но без
    // пустой строки после — следующий абзац идёт вплотную.
    const raw = `# Заголовок

<!-- IMG (из Buildin, перезалить отдельно) -->
При синтаксической ошибке интерпретатор показывает сообщение.`;

    const result = sanitizeTheoryBody(raw);

    // Плейсхолдер присутствует
    expect(result).toContain("иллюстрация — скоро");
    // Текст следующего абзаца сохранён
    expect(result).toContain("При синтаксической ошибке");
    // Плейсхолдер НЕ склеен с текстом на одной строке:
    // между "_" и "При" должен быть хотя бы один перевод строки
    expect(result).not.toMatch(/иллюстрация — скоро_[^\n]*При синтаксической/);
    // Между плейсхолдером и следующим абзацем — как минимум один перевод строки
    const placeholderEnd =
      result.indexOf("иллюстрация — скоро_") + "иллюстрация — скоро_".length;
    const textStart = result.indexOf("При синтаксической");
    const between = result.slice(placeholderEnd, textStart);
    expect(between).toMatch(/\n/);
  });

  it("handles multiple consecutive IMG placeholders", () => {
    const raw = `<!-- IMG (из Buildin, перезалить отдельно) -->
<!-- IMG (из Buildin, перезалить отдельно) -->
Текст после двух плейсхолдеров.`;

    const result = sanitizeTheoryBody(raw);
    // Оба плейсхолдера присутствуют
    const count = (result.match(/иллюстрация — скоро/g) || []).length;
    expect(count).toBe(2);
    // Текст НЕ склеен с плейсхолдером на одной строке
    expect(result).not.toMatch(/иллюстрация — скоро_[^\n]*Текст после/);
    // Между последним плейсхолдером и текстом есть переход строки
    const lastPlaceholderEnd =
      result.lastIndexOf("иллюстрация — скоро_") + "иллюстрация — скоро_".length;
    const textStart = result.indexOf("Текст после");
    expect(result.slice(lastPlaceholderEnd, textStart)).toMatch(/\n/);
  });

  it("strips Hexlet «Далее» navigation heading", () => {
    const raw = `---
title: Test
---

Текст урока.

\`\`\`html
<p>ok</p>
\`\`\`

## Далее →
`;
    expect(sanitizeTheoryBody(raw)).not.toMatch(/Далее/);
    expect(sanitizeTheoryBody(raw)).toContain("Текст урока");
  });

  it("strips bold Hexlet «Далее →» navigation heading", () => {
    const raw = `Текст урока.

## **Далее → **
`;
    expect(sanitizeTheoryBody(raw)).not.toMatch(/Далее/);
    expect(sanitizeTheoryBody(raw)).toContain("Текст урока");
  });
});
