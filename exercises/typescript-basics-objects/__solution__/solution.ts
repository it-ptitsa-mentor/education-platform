interface Course {
  name: string;
  lessons: string[];
}

export const isComplete = (course: Course): boolean => {
  return course.lessons.length >= 4;
};
