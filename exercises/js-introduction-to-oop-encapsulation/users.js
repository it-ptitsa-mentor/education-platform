const user1 = makeUser({
  friends: [
    makeUser({ id: 1 }),
    makeUser({ id: 2 }), // общий друг
  ],
});
const user2 = makeUser({
  friends: [
    makeUser({ id: 2 }), // общий друг
    makeUser({ id: 3 }),
  ],
});

getMutualFriends(user1, user2); // [ { friends: [], id: 2, getFriends: [Function: getFriends] } ] - массив состоящий из одного пользователя, общего друга