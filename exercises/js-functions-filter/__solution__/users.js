const getGirlFriends = (users) =>
  users
    .map((user) => user.friends)
    .flat()
    .filter((friend) => friend.gender === 'female');

export default getGirlFriends;
