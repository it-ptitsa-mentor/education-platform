import { createContext, useContext } from "react";
import type { Course, LessonRef } from "../course";

export type LessonContextValue = {
  course: Course;
  current: LessonRef;
  prev: LessonRef | null;
  next: LessonRef | null;
  progressVersion: number;
  refreshProgress: () => void;
};

export const LessonContext = createContext<LessonContextValue | null>(null);

export const useLesson = () => {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error("useLesson must be used inside LessonLayout");
  return ctx;
};
