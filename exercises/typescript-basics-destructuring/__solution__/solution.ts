// @ts-check

type Course = {
  lessons: unknown[]
}

const lessonsCount = ({ lessons }: Course): number => lessons.length

export default lessonsCount
