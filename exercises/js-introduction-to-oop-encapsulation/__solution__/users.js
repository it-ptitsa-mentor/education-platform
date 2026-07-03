export const getMutualFriends = (user1, user2) => {
  const friendIds = user2.getFriends().map((friend) => friend.id);
  return user1.getFriends().filter((friend) => friendIds.includes(friend.id));
};

export default getMutualFriends;
