const takeOldest = (users, count = 1) =>
  [...users]
    .sort((a, b) => Date.parse(a.birthday) - Date.parse(b.birthday))
    .slice(0, count);

export default takeOldest;
