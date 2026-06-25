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

/** Шаг урока для ссылки: предпочитаемый, если доступен, иначе первый в потоке. */
export const preferredLessonUnit = (
  lesson: Lesson,
  prefer: LessonUnit,
): LessonUnit => {
  const units = lessonUnits(lesson);
  return units.includes(prefer) ? prefer : (units[0] ?? "theory");
};

export type LessonContinueTarget = {
  type: "route";
  to: string;
  label: string;
};

export const LESSON_CONTINUE_LABEL = "Далее";

const routeTarget = (to: string): LessonContinueTarget => ({
  type: "route",
  to,
  label: LESSON_CONTINUE_LABEL,
});

const nextLessonRef = (
  lessons: LessonRef[],
  current: LessonRef,
): LessonRef | null => {
  const pos = lessons.findIndex((l) => l.id === current.id);
  if (pos < 0 || pos >= lessons.length - 1) return null;
  return lessons[pos + 1] ?? null;
};

const prevLessonRef = (
  lessons: LessonRef[],
  current: LessonRef,
): LessonRef | null => {
  const pos = lessons.findIndex((l) => l.id === current.id);
  if (pos <= 0) return null;
  return lessons[pos - 1] ?? null;
};

export type LessonNavLink = {
  to: string;
  title: string;
  hint?: string;
};

export const lastUnitOfLesson = (lesson: Lesson): LessonUnit => {
  const units = lessonUnits(lesson);
  return units[units.length - 1] ?? "theory";
};

/** Ссылка «назад» в футере: предыдущий шаг урока или последний шаг прошлого урока. */
export const lessonFooterPrev = (
  ref: LessonRef,
  allLessons: LessonRef[],
  activeUnit: LessonUnit,
): LessonNavLink | null => {
  const previousUnit = prevUnit(ref.lesson, activeUnit);
  if (previousUnit) {
    return {
      to: lessonUnitPath(ref, previousUnit),
      title: unitLabel(previousUnit),
    };
  }

  const previousLesson = prevLessonRef(allLessons, ref);
  if (!previousLesson) return null;

  const unit = lastUnitOfLesson(previousLesson.lesson);
  return {
    to: lessonUnitPath(previousLesson, unit),
    title: previousLesson.lesson.title,
    hint: unitLabel(unit),
  };
};

const navLinkFromContinueTarget = (
  ref: LessonRef,
  allLessons: LessonRef[],
  target: LessonContinueTarget,
): LessonNavLink => {
  const destinationUnit = activeUnitFromPath(target.to);
  const sameLesson =
    target.to.startsWith(`${lessonFlowPath(ref)}/`) ||
    target.to === lessonFlowPath(ref);

  if (sameLesson && destinationUnit !== "theory") {
    return { to: target.to, title: unitLabel(destinationUnit) };
  }

  if (sameLesson) {
    return { to: target.to, title: unitLabel("theory") };
  }

  const nextLesson = nextLessonRef(allLessons, ref);
  return {
    to: target.to,
    title: nextLesson?.lesson.title ?? "Следующий урок",
    hint: unitLabel("theory"),
  };
};

/** Ссылка «вперёд» в футере по текущему шагу урока. */
export const lessonFooterNext = (
  ref: LessonRef,
  allLessons: LessonRef[],
  activeUnit: LessonUnit,
): LessonNavLink | null => {
  const target =
    activeUnit === "theory"
      ? lessonTheoryContinueTarget(ref, allLessons)
      : activeUnit === "quiz"
        ? lessonQuizContinueTarget(ref, allLessons)
        : lessonExerciseContinueTarget(ref, allLessons);

  if (!target) return null;
  return navLinkFromContinueTarget(ref, allLessons, target);
};


/** Теория следующего урока — только после квиза и практики текущего. */
export const nextLessonTheoryTarget = (next: LessonRef): LessonContinueTarget =>
  routeTarget(lessonUnitPath(next, "theory"));

/** После теории: квиз → практика → теория следующего урока. */
export const lessonTheoryContinueTarget = (
  ref: LessonRef,
  allLessons: LessonRef[],
): LessonContinueTarget | null => {
  const { lesson } = ref;
  if (lesson.quiz) {
    return routeTarget(lessonUnitPath(ref, "quiz"));
  }
  if (lesson.exercise) {
    return routeTarget(lessonUnitPath(ref, "exercise"));
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
    return routeTarget(lessonUnitPath(ref, "exercise"));
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
