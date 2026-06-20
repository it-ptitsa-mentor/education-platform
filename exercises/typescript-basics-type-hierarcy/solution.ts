const userJson = JSON.stringify({
  users: [
    { id: 1, name: 'John', age: 20 },
    { id: 2, name: 'Mary', age: 21 },
    { id: 3, name: 'Kate', age: 19 },
    { id: 4, name: 'Ann', age: 18 },
  ],
  friends: [
    [1, 2],
    [1, 3]
  ],
});

getUserFriends(userJson, 1); // [{ id: 2, name: 'Mary', age: 21 }, { id: 3, name: 'Kate', age: 19 }]
getUserFriends(userJson, 2); // [{ id: 1, name: 'John', age: 20 }]
getUserFriends(userJson, 3); // [{ id: 1, name: 'John', age: 20 }]
getUserFriends(userJson, 4); // []