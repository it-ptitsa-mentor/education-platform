const response = UserResponse.fromArray(['user1', 'user2', 'user3']);
console.log(response[0].user); // user1
console.log(response[0] instanceof UserResponse); // true