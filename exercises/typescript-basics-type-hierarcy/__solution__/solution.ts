// @ts-check
type User = {
  id: number
  name: string
  age: number
}

type Friends = [number, number]

export type UserResponse = {
  users: User[]
  friends: Friends[]
}

const getUserFriends = (json: string, userId: number): User[] => {
  const { users, friends }: UserResponse = JSON.parse(json)
  const friendIds = friends
    .filter((pair) => pair.includes(userId))
    .map((pair) => (pair[0] === userId ? pair[1] : pair[0]))
  return users.filter((user) => friendIds.includes(user.id))
}

export default getUserFriends
