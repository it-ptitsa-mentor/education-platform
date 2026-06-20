const users = [
  { id: 'user1', username: 'user1', name: 'User 1' },
  { id: 'user2', username: 'user2', name: 'User 2' },
  { id: 'user3', username: 'user3', name: 'User 3' },
];

const posts = [
  {
    id: 'post1',
    author: 'user1',
    body: 'Первый пост',
    comments: ['comment1', 'comment2'],
  },
  {
    id: 'post2',
    author: 'user2',
    body: 'Второй пост',
    comments: [],
  },
];

const comments = [
  {
    id: 'comment1',
    author: 'user2',
    text: 'Первый комментарий',
  },
  {
    id: 'comment2',
    author: 'user3',
    text: 'Второй комментарий',
  },
];