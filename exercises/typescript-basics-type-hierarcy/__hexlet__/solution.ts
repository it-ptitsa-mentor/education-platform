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

// BEGIN (write your solution here)

// END

export default getUserFriends
