interface User {
  id: number;
  name: string;
  age: number;
}

interface Data {
  users: User[];
  friends: [number, number][];
}

export const getUserFriends = (json: string, userId: number): User[] => {
  const data: Data = JSON.parse(json);
  const user = data.users.find((u) => u.id === userId);
  if (!user) return [];
  const friendIds = data.friends
    .filter(([a, b]) => a === userId || b === userId)
    .map(([a, b]) => (a === userId ? b : a));
  return data.users.filter((u) => friendIds.includes(u.id));
};
