import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { starterForFile } from "../packages/shared/src/exercise-starter-from-readme.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cookiesPath = path.join(repoRoot, ".hexlet-cookies.json");
const exercisesRoot = path.join(repoRoot, "exercises");
const catalogPath = path.join(repoRoot, "scripts/hexlet-import/catalog.json");
const myCachePath = path.join(repoRoot, "scripts/hexlet-import/my-program.json");

type Cookie = { name: string; value: string; domain?: string };

type HexletCourse = { id: number; slug: string; name: string };

type HexletExercise = {
  id: number;
  slug: string;
  language: string;
  readme: string;
  entity_name: string | null;
  has_web_view: boolean;
};

type HexletLesson = {
  slug: string;
  name: string;
  exercise: HexletExercise | null;
  units: { name: string; url: string }[];
};

type CatalogEntry = {
  slug: string;
  title: string;
  language: string;
  courseSlug: string;
  courseName: string;
  lessonSlug: string;
  lessonName: string;
  hexletExerciseSlug: string;
  sourceUrl: string;
  filesToOpen: string[];
  readme: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toSlug = (hexletSlug: string) =>
  hexletSlug.replace(/_/g, "-").replace(/-exercise$/, "");

const loadCookies = async (): Promise<string> => {
  const raw = await readFile(cookiesPath, "utf8");
  const cookies = JSON.parse(raw) as Cookie[];
  return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
};

const fetchJson = async <T>(url: string, cookieHeader: string): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      Cookie: cookieHeader,
      Accept: "application/json",
      "User-Agent": "ptitsa-importer/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json() as Promise<T>;
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

  const page = JSON.parse(match[1]) as {
    component: string;
    props: Record<string, unknown>;
  };

  if (page.component.includes("errors/not_found")) {
    throw new Error(`Page not found: ${url}`);
  }

  return page.props;
};

const defaultFilesForLanguage = (language: string): string[] => {
  if (language === "html") return ["index.html"];
  if (language === "shell") return ["solution"];
  return ["solution.js"];
};

const resolveFilesToOpen = async (

describe("${slug}", () => {
  it("placeholder — оригинальные тесты Hexlet пока не импортированы", () => {
    expect(true).toBe(true);
  });
});
`;

const loadFrontendCourses = async (cookieHeader: string): Promise<HexletCourse[]> => {
  try {
    const cached = await readFile(myCachePath, "utf8");
    const parsed = JSON.parse(cached) as { courses: HexletCourse[] };
    if (parsed.courses.length > 0) return parsed.courses;
  } catch {
    // fetch fresh
  }

  const html = await (
    await fetch("https://ru.hexlet.io/my", {
      headers: { Cookie: cookieHeader, "User-Agent": "Mozilla/5.0" },
    })
  ).text();

  const match = html.match(/<script[^>]*data-page="app"[^>]*>(\{.*?\})<\/script>/s);
  if (!match) throw new Error("Cannot load /my program data");

  const props = JSON.parse(match[1]).props as {
    currentStackVariantCoursesByModuleId: Record<string, HexletCourse[]>;
  };

  const courses = Object.values(props.currentStackVariantCoursesByModuleId).flat();
  await mkdir(path.dirname(myCachePath), { recursive: true });
  await writeFile(myCachePath, JSON.stringify({ courses }, null, 2), "utf8");
  return courses;
};

const resolveFilesToOpen = async (
  exerciseUrl: string,
  cookieHeader: string,
  language: string,
): Promise<string[]> => {
  try {
    const props = await fetchInertiaProps(`https://ru.hexlet.io${exerciseUrl}`, cookieHeader);
    const instance = props.instance as { files_to_open?: string[] } | undefined;
    if (instance?.files_to_open?.length) {
      return instance.files_to_open;
    }
  } catch {
    // fallback below
  }

  return defaultFilesForLanguage(language);
};

const mapLanguage = (language: string): "javascript" | "html" | "shell" => {
  if (language === "html") return "html";
  if (language === "shell") return "shell";
  return "javascript";
};

const writeExercise = async (entry: CatalogEntry) => {
  const exerciseDir = path.join(exercisesRoot, entry.slug);
  await mkdir(exerciseDir, { recursive: true });

  const studentFiles = entry.filesToOpen;
  const manifest = {
    slug: entry.slug,
    title: entry.title,
    language: mapLanguage(entry.language),
    filesToOpen: entry.filesToOpen,
    studentFiles,
    readme: entry.readme,
    hexlet: {
      courseSlug: entry.courseSlug,
      courseName: entry.courseName,
      lessonSlug: entry.lessonSlug,
      lessonName: entry.lessonName,
      exerciseSlug: entry.hexletExerciseSlug,
      sourceUrl: entry.sourceUrl,
    },
  };

  await writeFile(
    path.join(exerciseDir, "exercise.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  await Promise.all(
    entry.filesToOpen.map(async (fileName) => {
      const content = starterForFile(
        fileName,
        entry.readme,
        entry.language,
        entry.filesToOpen,
      );
      const filePath = path.join(exerciseDir, fileName);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, content, "utf8");
    }),
  );

  await mkdir(path.join(exerciseDir, "__tests__"), { recursive: true });
  await writeFile(
    path.join(exerciseDir, "__tests__/placeholder.test.js"),
    placeholderTest(entry.slug),
    "utf8",
  );
};

const main = async () => {
  const writeOnly = process.argv.includes("--write-only");
  const cookieHeader = await loadCookies();

  let catalog: CatalogEntry[];

  if (writeOnly) {
    catalog = JSON.parse(await readFile(catalogPath, "utf8")) as CatalogEntry[];
    console.log(`Write-only mode: ${catalog.length} exercises from catalog`);
  } else {
    const courses = await loadFrontendCourses(cookieHeader);
    catalog = [];

    console.log(`Frontend program: ${courses.length} courses`);

    for (const [courseIndex, course] of courses.entries()) {
      const { lessons } = await fetchJson<{ lessons: HexletLesson[] }>(
        `https://ru.hexlet.io/api/courses/${course.id}/lessons`,
        cookieHeader,
      );

      const withExercise = lessons.filter((lesson) => lesson.exercise);
      console.log(
        `[${courseIndex + 1}/${courses.length}] ${course.slug}: ${withExercise.length} exercises`,
      );

      for (const lesson of withExercise) {
        const exercise = lesson.exercise!;
        const exerciseUnit = lesson.units.find((unit) => unit.name === "exercise");
        if (!exerciseUnit) continue;

        const slug = toSlug(exercise.slug);
        if (slug === "js-variables") continue;

        const filesToOpen = await resolveFilesToOpen(
          exerciseUnit.url,
          cookieHeader,
          exercise.language,
        );

        catalog.push({
          slug,
          title: exercise.entity_name ?? lesson.name,
          language: exercise.language,
          courseSlug: course.slug,
          courseName: course.name,
          lessonSlug: lesson.slug,
          lessonName: lesson.name,
          hexletExerciseSlug: exercise.slug,
          sourceUrl: `https://ru.hexlet.io${exerciseUnit.url}`,
          filesToOpen,
          readme: exercise.readme,
        });

        await sleep(120);
      }
    }

    await mkdir(path.dirname(catalogPath), { recursive: true });
    await writeFile(catalogPath, JSON.stringify(catalog, null, 2), "utf8");
  }

  console.log(`Writing ${catalog.length} exercises to ${exercisesRoot}`);

  for (const entry of catalog) {
    await writeExercise(entry);
  }

  console.log(`Done. Catalog: ${catalogPath}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
