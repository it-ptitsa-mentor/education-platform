interface Course {
  lessons: string[];
  [key: string]: unknown;
}

export const lessonsCount = ({ lessons }: Course): number => {
  return lessons.length;
};
