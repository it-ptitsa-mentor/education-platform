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

const stripFrontmatter = (md: string) =>
  md
    .replace(/^---\n[\s\S]*?\n---\n+/, "")
    // плейсхолдеры картинок из Buildin → аккуратная пометка
    .replace(/<!--\s*IMG[^>]*-->/g, "> 🖼 _иллюстрация — скоро_");

export const loadTheory = async (theoryPath: string): Promise<string> => {
  const rel = theoryPath.replace(/^content\/theory\//, "");
  const res = await fetch(`${base}course/theory/${rel}`);
  if (!res.ok) throw new Error("Не удалось загрузить теорию");
  return stripFrontmatter(await res.text());
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

// ── прогресс в localStorage ──
const PKEY = "ptitsa-course-progress";
type Progress = Record<string, boolean>; // lessonId -> завершён

export const readProgress = (): Progress => {
  try {
    return JSON.parse(localStorage.getItem(PKEY) || "{}") as Progress;
  } catch {
    return {};
  }
};
export const markLessonDone = (id: string, done = true) => {
  const p = readProgress();
  p[id] = done;
  localStorage.setItem(PKEY, JSON.stringify(p));
};
