/**
 * Откуда студент вошёл в урок — чтобы выход вёл к своему курсу,
 * а не ко всем программам.
 *
 * Зачем состояние, а не вычисление по slug'ам: одна и та же тема может
 * входить в несколько роадмапов (например `02-modul-2/02-js-massivy`
 * встречается и в `frontend-bootcamp`, и в `react-first`). Однозначно
 * восстановить курс из `/learn/:moduleSlug/:topicSlug/...` нельзя —
 * поэтому запоминаем точку входа при переходе «К урокам на платформе».
 *
 * Приоритет источников (как в `track.ts`):
 * 1. URL-параметр `?from=<roadmapId>` — переживает открытие в новой вкладке
 * 2. localStorage под ключом `ptitsa.lesson-origin`
 * 3. `null` — вызывающий код сам решает, куда вести (обычно «/»)
 */

const STORAGE_KEY = "ptitsa.lesson-origin";

export type LessonOrigin = {
  roadmapId: string;
  /** Узел роадмапа, из которого зашли (если известен). */
  nodeId?: string;
};

const isNonEmpty = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

/** Запомнить точку входа в уроки. Вызывается при переходе из роадмапа. */
export const rememberLessonOrigin = (origin: LessonOrigin): void => {
  if (typeof window === "undefined") return;
  if (!isNonEmpty(origin.roadmapId)) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(origin));
  } catch {
    // Ignore — приватный режим или заблокированный storage
  }
};

/** Прочитать точку входа: сначала URL `?from=`, затем localStorage. */
export const readLessonOrigin = (search?: string): LessonOrigin | null => {
  if (typeof window === "undefined") return null;

  // 1. URL ?from=<roadmapId>&fromNode=<nodeId>
  try {
    const params = new URLSearchParams(search ?? window.location.search);
    const fromRoadmap = params.get("from");
    if (isNonEmpty(fromRoadmap)) {
      const fromNode = params.get("fromNode");
      return {
        roadmapId: fromRoadmap,
        ...(isNonEmpty(fromNode) ? { nodeId: fromNode } : {}),
      };
    }
  } catch {
    // Ignore — битый query string
  }

  // 2. localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      isNonEmpty((parsed as LessonOrigin).roadmapId)
    ) {
      const { roadmapId, nodeId } = parsed as LessonOrigin;
      return { roadmapId, ...(isNonEmpty(nodeId) ? { nodeId } : {}) };
    }
  } catch {
    // Ignore — невалидный JSON
  }

  return null;
};

export const clearLessonOrigin = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
};
