import type { Lesson, LessonRef, LessonUnit } from "../course";

export type { LessonUnit };

const UNIT_LABELS: Record<LessonUnit, string> = {
  theory: "Теория",
  quiz: "Квиз",
  exercise: "Практика",
};

export const unitLabel = (unit: LessonUnit) => UNIT_LABELS[unit];

/** Доступные шаги урока в порядке прохождения. */
export const lessonUnits = (lesson: Lesson): LessonUnit[] => {
  const units: LessonUnit[] = ["theory"];
  if (lesson.quiz) units.push("quiz");
  if (lesson.exercise) units.push("exercise");
  return units;
};

export const lessonFlowPath = (ref: LessonRef) =>
  `/learn/${ref.module.slug}/${ref.topic.slug}/${ref.lesson.index}`;

/** URL шага урока (как theory_unit / quiz_unit на Hexlet). */
export const lessonUnitPath = (ref: LessonRef, unit: LessonUnit) =>
  `${lessonFlowPath(ref)}/${unit}`;

export const topicEntryPath = (moduleSlug: string, topicSlug: string) =>
  `/learn/${moduleSlug}/${topicSlug}/1/theory`;

export const nextUnit = (
  lesson: Lesson,
  current: LessonUnit,
): LessonUnit | null => {
  const units = lessonUnits(lesson);
  const idx = units.indexOf(current);
  if (idx < 0 || idx >= units.length - 1) return null;
  return units[idx + 1] ?? null;
};

export const prevUnit = (
  lesson: Lesson,
  current: LessonUnit,
): LessonUnit | null => {
  const units = lessonUnits(lesson);
  const idx = units.indexOf(current);
  if (idx <= 0) return null;
  return units[idx - 1] ?? null;
};

export const isUnitAvailable = (lesson: Lesson, unit: LessonUnit) =>
  lessonUnits(lesson).includes(unit);

export type LessonContinueTarget = {
  type: "route";
  to: string;
  label: string;
};

const routeTarget = (to: string, label: string): LessonContinueTarget => ({
  type: "route",
  to,
  label,
});

const nextLessonRef = (
  lessons: LessonRef[],
  current: LessonRef,
): LessonRef | null => {
  const pos = lessons.findIndex((l) => l.id === current.id);
  if (pos < 0 || pos >= lessons.length - 1) return null;
  return lessons[pos + 1] ?? null;
};

/** Теория следующего урока — только после квиза и практики текущего. */
export const nextLessonTheoryTarget = (
  next: LessonRef,
): LessonContinueTarget =>
  routeTarget(
    lessonUnitPath(next, "theory"),
    `Следующий урок: ${next.lesson.title}`,
  );

/** После теории: квиз → практика → теория следующего урока. */
export const lessonTheoryContinueTarget = (
  ref: LessonRef,
  allLessons: LessonRef[],
): LessonContinueTarget | null => {
  const { lesson } = ref;
  if (lesson.quiz) {
    return routeTarget(lessonUnitPath(ref, "quiz"), "Далее к квизу");
  }
  if (lesson.exercise) {
    return routeTarget(lessonUnitPath(ref, "exercise"), "Далее к практике");
  }

  const next = nextLessonRef(allLessons, ref);
  if (next) {
    return nextLessonTheoryTarget(next);
  }

  return null;
};

/** После квиза: практика этого урока или следующий урок. */
export const lessonQuizContinueTarget = (
  ref: LessonRef,
  allLessons: LessonRef[],
): LessonContinueTarget | null => {
  const { lesson } = ref;
  if (lesson.exercise) {
    return routeTarget(lessonUnitPath(ref, "exercise"), "Далее к практике");
  }

  const next = nextLessonRef(allLessons, ref);
  if (next) {
    return nextLessonTheoryTarget(next);
  }

  return null;
};

/** После практики — следующий урок в теме. */
export const lessonExerciseContinueTarget = (
  ref: LessonRef,
  allLessons: LessonRef[],
): LessonContinueTarget | null => {
  const next = nextLessonRef(allLessons, ref);
  if (!next) return null;
  return nextLessonTheoryTarget(next);
};

export const activeUnitFromPath = (pathname: string): LessonUnit => {
  if (pathname.endsWith("/quiz")) return "quiz";
  if (pathname.endsWith("/exercise")) return "exercise";
  return "theory";
};
