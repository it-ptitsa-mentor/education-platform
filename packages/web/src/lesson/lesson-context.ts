import { createContext, useContext } from "react";
import type { Course, LessonRef, Module, Topic } from "../course";

export type LessonContextValue = {
  course: Course;
  module: Module;
  topic: Topic;
  current: LessonRef;
  topicLessons: LessonRef[];
  allLessons: LessonRef[];
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
