const getSortedNames = (users) => {
  const names = [];
  for (const { name } of users) {
    names.push(name);
  }
  return names.sort();
};

export default getSortedNames;
