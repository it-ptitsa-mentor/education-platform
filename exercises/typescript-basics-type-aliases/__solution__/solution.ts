// @ts-check

type User = {
  name: string
  age: number
}

const getOlderUser = (a: User, b: User): User | null => {
  if (a.age === b.age) {
    return null
  }
  return a.age > b.age ? a : b
}

export type { User }
export default getOlderUser
