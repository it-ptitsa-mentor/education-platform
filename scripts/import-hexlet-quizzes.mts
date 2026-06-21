import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { QuizManifest, QuizQuestion } from "../packages/shared/src/quiz-manifest-types.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cookiesPath = path.join(repoRoot, ".hexlet-cookies.json");
const quizzesRoot = path.join(repoRoot, "quizzes");
const catalogPath = path.join(repoRoot, "scripts/hexlet-import/quiz-catalog.json");
const myCachePath = path.join(repoRoot, "scripts/hexlet-import/my-program.json");

type Cookie = { name: string; value: string };

type HexletCourse = { id: number; slug: string; name: string };

type HexletLesson = {
  id: number;
  slug: string;
  name: string;
  units: { name: string; url: string }[];
};

type CatalogEntry = QuizManifest & {
  hexlet: NonNullable<QuizManifest["hexlet"]>;
};

type HexletQuestion = {
  id: number;
  slug: string;
  question: string;
  type: string;
  multiple_correct_answers?: boolean;
  items?: Array<{ id: number; value: string; correct: boolean }>;
  shaffled_items?: Array<{ id: number; value: string; correct: boolean }>;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadCookies = async () => {
  const cookies = JSON.parse(await readFile(cookiesPath, "utf8")) as Cookie[];
  const cookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
  const xsrf = decodeURIComponent(
    cookies.find((cookie) => cookie.name === "XSRF-TOKEN")?.value ?? "",
  );
  return { cookieHeader, xsrf };
};

const fetchInertiaProps = async (url: string, cookieHeader: string) => {
  const response = await fetch(url, {
    headers: {
      Cookie: cookieHeader,
      Accept: "text/html",
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const html = await response.text();
  const match = html.match(/<script[^>]*data-page="app"[^>]*>(\{.*?\})<\/script>/s);
  if (!match) {
    throw new Error(`No Inertia payload for ${url}`);
  }

  return JSON.parse(match[1]).props as Record<string, unknown>;
};

const loadFrontendCourses = async (cookieHeader: string): Promise<HexletCourse[]> => {
  try {
    const cached = await readFile(myCachePath, "utf8");
    const parsed = JSON.parse(cached) as { courses: HexletCourse[] };
    if (parsed.courses.length > 0) {
      return parsed.courses;
    }
  } catch {
    // fetch fresh
  }

  const html = await (
    await fetch("https://ru.hexlet.io/my", {
      headers: { Cookie: cookieHeader, "User-Agent": "Mozilla/5.0" },
    })
  ).text();

  const match = html.match(/<script[^>]*data-page="app"[^>]*>(\{.*?\})<\/script>/s);
  if (!match) {
    throw new Error("Cannot load /my program data");
  }

  const props = JSON.parse(match[1]).props as {
    currentStackVariantCoursesByModuleId: Record<string, HexletCourse[]>;
  };

  return Object.values(props.currentStackVariantCoursesByModuleId).flat();
};

const resetLessonQuiz = async (
  lessonId: number,
  cookieHeader: string,
  xsrf: string,
) => {
  const response = await fetch(`https://ru.hexlet.io/api/lessons/${lessonId}/reset_quiz.json`, {
    method: "PATCH",
    headers: {
      Cookie: cookieHeader,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": xsrf,
    },
    body: "{}",
  });

  if (response.status !== 204 && response.status !== 200) {
    throw new Error(`reset_quiz failed for lesson ${lessonId}: HTTP ${response.status}`);
  }
};

const mapQuestion = (question: HexletQuestion): QuizQuestion | null => {
  const items = question.items ?? question.shaffled_items ?? [];
  if (items.length === 0) {
    return null;
  }

  return {
    id: String(question.id),
    prompt: question.question.trim(),
    multiple: Boolean(question.multiple_correct_answers),
    options: items.map((item) => ({
      id: String(item.id),
      text: item.value.trim(),
      correct: Boolean(item.correct),
    })),
  };
};

const submitCorrectAnswer = async ({
  lessonId,
  question,
  cookieHeader,
  xsrf,
}: {
  lessonId: number;
  question: HexletQuestion;
  cookieHeader: string;
  xsrf: string;
}) => {
  const items = question.items ?? question.shaffled_items ?? [];
  const correctIds = items.filter((item) => item.correct).map((item) => String(item.id));

  const response = await fetch(
    `https://ru.hexlet.io/api/lessons/${lessonId}/questions/${question.id}/results`,
    {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": xsrf,
      },
      body: JSON.stringify({ ids: correctIds }),
    },
  );

  if (!response.ok) {
    throw new Error(`submit answer failed for question ${question.id}: HTTP ${response.status}`);
  }
};

const harvestLessonQuiz = async ({
  quizUrl,
  lessonId,
  cookieHeader,
  xsrf,
}: {
  quizUrl: string;
  lessonId: number;
  cookieHeader: string;
  xsrf: string;
}) => {
  const questions: QuizQuestion[] = [];
  const seenQuestionIds = new Set<number>();
  let props = await fetchInertiaProps(`https://ru.hexlet.io${quizUrl}`, cookieHeader);
  const expectedCount = (props.questions as Array<{ id: number }>).length;

  while (questions.length < expectedCount) {
    const current = props.currentQuestion as HexletQuestion | null;
    if (!current || seenQuestionIds.has(current.id)) {
      break;
    }

    const mapped = mapQuestion(current);
    if (!mapped) {
      break;
    }

    questions.push(mapped);
    seenQuestionIds.add(current.id);
    await submitCorrectAnswer({ lessonId, question: current, cookieHeader, xsrf });
    await sleep(100);
    props = await fetchInertiaProps(`https://ru.hexlet.io${quizUrl}`, cookieHeader);
  }

  if (questions.length !== expectedCount) {
    throw new Error(
      `expected ${expectedCount} questions, harvested ${questions.length} for lesson ${lessonId}`,
    );
  }

  return questions;
};

const importLessonQuiz = async ({
  course,
  lesson,
  cookieHeader,
  xsrf,
}: {
  course: HexletCourse;
  lesson: HexletLesson;
  cookieHeader: string;
  xsrf: string;
}) => {
  const quizUnit = lesson.units.find((unit) => unit.name === "quiz");
  if (!quizUnit) {
    return null;
  }

  await resetLessonQuiz(lesson.id, cookieHeader, xsrf);
  await sleep(120);

  const questions = await harvestLessonQuiz({
    quizUrl: quizUnit.url,
    lessonId: lesson.id,
    cookieHeader,
    xsrf,
  });

  if (questions.length === 0) {
    return null;
  }

  const slug = `${course.slug}-${lesson.slug}`;

  return {
    slug,
    title: lesson.name,
    questions,
    hexlet: {
      courseSlug: course.slug,
      courseName: course.name,
      lessonSlug: lesson.slug,
      lessonName: lesson.name,
      sourceUrl: `https://ru.hexlet.io${quizUnit.url}`,
      lessonId: lesson.id,
    },
  } satisfies CatalogEntry;
};

const writeQuiz = async (entry: CatalogEntry) => {
  const quizDir = path.join(quizzesRoot, entry.slug);
  await mkdir(quizDir, { recursive: true });
  await writeFile(
    path.join(quizDir, "quiz.json"),
    `${JSON.stringify(entry, null, 2)}\n`,
    "utf8",
  );
};

const main = async () => {
  const writeOnly = process.argv.includes("--write-only");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number.parseInt(limitArg.split("=")[1] ?? "", 10) : Infinity;

  let catalog: CatalogEntry[];

  if (writeOnly) {
    catalog = JSON.parse(await readFile(catalogPath, "utf8")) as CatalogEntry[];
    console.log(`Write-only mode: ${catalog.length} quizzes from catalog`);
  } else {
    const { cookieHeader, xsrf } = await loadCookies();
    const courses = await loadFrontendCourses(cookieHeader);
    catalog = [];

    console.log(`Frontend program: ${courses.length} courses`);

    for (const [courseIndex, course] of courses.entries()) {
      const response = await fetch(`https://ru.hexlet.io/api/courses/${course.id}/lessons`, {
        headers: {
          Cookie: cookieHeader,
          Accept: "application/json",
          "User-Agent": "ptitsa-importer/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for course ${course.slug}`);
      }

      const { lessons } = (await response.json()) as { lessons: HexletLesson[] };
      const withQuiz = lessons.filter((lesson) => lesson.units.some((unit) => unit.name === "quiz"));

      console.log(
        `[${courseIndex + 1}/${courses.length}] ${course.slug}: ${withQuiz.length} quizzes`,
      );

      for (const lesson of withQuiz) {
        if (catalog.length >= limit) {
          break;
        }

        try {
          const entry = await importLessonQuiz({ course, lesson, cookieHeader, xsrf });
          if (entry) {
            catalog.push(entry);
            await writeQuiz(entry);
            console.log(`  + ${entry.slug} (${entry.questions.length} questions)`);
          }
        } catch (error) {
          console.warn(`  ! skip ${course.slug}/${lesson.slug}:`, error);
        }

        await sleep(150);
      }

      if (catalog.length >= limit) {
        break;
      }
    }

    await mkdir(path.dirname(catalogPath), { recursive: true });
    await writeFile(catalogPath, JSON.stringify(catalog, null, 2), "utf8");
  }

  console.log(`Writing ${catalog.length} quizzes to ${quizzesRoot}`);
  for (const entry of catalog) {
    await writeQuiz(entry);
  }

  console.log(`Done. Catalog: ${catalogPath}`);
  console.warn(
    "Note: import resets quiz progress on Hexlet for imported lessons (PATCH /api/lessons/:id/reset_quiz).",
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
