// Модель курса (связка теория ↔ квиз ↔ практика) + ленивые загрузчики.

export type Lesson = {
  index: number;
  title: string;
  theory: string; // путь вида content/theory/<m>/<t>/<l>.md
  quiz: string | null;
  exercise: string | null;
};
export type Topic = {
  index: number;
  title: string;
  slug: string;
  course_slug: string | null;
  lessons: Lesson[];
};
export type Module = {
  index: number;
  title: string;
  slug: string;
  topics: Topic[];
};
export type Course = {
  course: string;
  course_id: string;
  modules: Module[];
};

const base = import.meta.env.BASE_URL;

let cache: Course | null = null;
export const loadCourse = async (): Promise<Course> => {
  if (cache) return cache;
  const res = await fetch(`${base}course/course.json`);
  if (!res.ok) throw new Error("Не удалось загрузить курс");
  cache = (await res.json()) as Course;
  return cache;
};

/** Очистка импортированного markdown перед показом в уроке. */
export const sanitizeTheoryBody = (md: string): string =>
  md
    .replace(/^---\n[\s\S]*?\n---\n+/, "")
    // плейсхолдеры картинок из Buildin → аккуратная пометка
    .replace(/<!--\s*IMG[^>]*-->/g, "> _иллюстрация — скоро_")
    // навигация Hexlet в конце статей — дублирует наш LessonUnitNav
    .replace(/\n##\s*Далее\s*→?\s*(\n|$)/gi, "\n")
    .trimEnd();

export const loadTheory = async (theoryPath: string): Promise<string> => {
  const rel = theoryPath.replace(/^content\/theory\//, "");
  const res = await fetch(`${base}course/theory/${rel}`);
  if (!res.ok) throw new Error("Не удалось загрузить теорию");
  return sanitizeTheoryBody(await res.text());
};

// ── плоский индекс уроков для навигации prev/next и по URL ──
export type LessonRef = {
  module: Module;
  topic: Topic;
  lesson: Lesson;
  id: string; // moduleSlug/topicSlug/lesson-index
  href: string;
};

export const flattenLessons = (course: Course): LessonRef[] => {
  const out: LessonRef[] = [];
  for (const m of course.modules)
    for (const t of m.topics)
      for (const l of t.lessons) {
        const id = `${m.slug}/${t.slug}/${l.index}`;
        out.push({ module: m, topic: t, lesson: l, id, href: `learn/${id}` });
      }
  return out;
};

// ── прогресс в localStorage (по шагам урока, как units у Hexlet) ──
export type LessonUnit = "theory" | "quiz" | "exercise";
export type LessonUnitProgress = Partial<Record<LessonUnit, boolean>>;

const PKEY = "ptitsa-course-progress";
type ProgressEntry = boolean | LessonUnitProgress;
type ProgressStore = Record<string, ProgressEntry>;

export const readProgress = (): ProgressStore => {
  try {
    return JSON.parse(localStorage.getItem(PKEY) || "{}") as ProgressStore;
  } catch {
    return {};
  }
};

/** Прогресс по шагам одного урока (старый boolean → все шаги done). */
export const readLessonUnits = (id: string): LessonUnitProgress => {
  const raw = readProgress()[id];
  if (raw === true) return { theory: true, quiz: true, exercise: true };
  if (!raw || typeof raw !== "object") return {};
  return raw;
};

export const isUnitDone = (id: string, unit: LessonUnit) =>
  Boolean(readLessonUnits(id)[unit]);

/** Урок завершён, когда пройдены все доступные шаги. */
export const isLessonComplete = (lesson: Lesson, id: string) => {
  const units = readLessonUnits(id);
  if (!units.theory) return false;
  if (lesson.quiz && !units.quiz) return false;
  if (lesson.exercise && !units.exercise) return false;
  return true;
};

export const countCompletedLessons = (
  lessonIds: string[],
  lessonsById: Map<string, Lesson>,
) =>
  lessonIds.filter((id) => {
    const lesson = lessonsById.get(id);
    return lesson ? isLessonComplete(lesson, id) : false;
  }).length;

export const markUnitDone = (id: string, unit: LessonUnit, done = true) => {
  const store = { ...readProgress() };
  const current = readLessonUnits(id);

  if (!done) {
    const next = { ...current };
    delete next[unit];
    if (Object.keys(next).length === 0) delete store[id];
    else store[id] = next;
  } else {
    store[id] = { ...current, [unit]: true };
  }

  localStorage.setItem(PKEY, JSON.stringify(store));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ptitsa-course-progress"));
  }
};

/** @deprecated Используй markUnitDone; оставлено для совместимости. */
export const markLessonDone = (id: string, done = true) => {
  if (!done) {
    const store = { ...readProgress() };
    delete store[id];
    localStorage.setItem(PKEY, JSON.stringify(store));
    return;
  }
  markUnitDone(id, "theory", true);
  markUnitDone(id, "quiz", true);
  markUnitDone(id, "exercise", true);
};
