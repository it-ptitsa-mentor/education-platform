// @ts-check

type Course = {
  name: string
  lessons: string[]
}

const isComplete = (course: Course): boolean => course.lessons.length >= 4

export default isComplete
