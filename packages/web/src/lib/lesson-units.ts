import type { Lesson, LessonRef, LessonUnit } from "../course";

export type { LessonUnit };

const UNIT_LABELS: Record<LessonUnit, string> = {
  theory: "Теория",
  quiz: "Квиз",
  exercise: "Практика",
};

export const unitLabel = (unit: LessonUnit) => UNIT_LABELS[unit];

/** Доступные шаги урока в порядке прохождения (как ordered_units у Hexlet). */
export const lessonUnits = (lesson: Lesson): LessonUnit[] => {
  const units: LessonUnit[] = ["theory"];
  if (lesson.quiz) units.push("quiz");
  if (lesson.exercise) units.push("exercise");
  return units;
};

export const lessonUnitPath = (ref: LessonRef, unit: LessonUnit) =>
  `/${ref.href}/${unit}`;

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
