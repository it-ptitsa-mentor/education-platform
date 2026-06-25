import { LessonTheoryContent } from "./LessonTheoryContent";
import { useLesson } from "./lesson-context";

export const LessonTheoryStep = () => {
  const { current } = useLesson();

  return <LessonTheoryContent theoryPath={current.lesson.theory} />;
};
