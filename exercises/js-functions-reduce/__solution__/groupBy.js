const groupBy = (items, property) => items.reduce((acc, item) => {
  const key = item[property];
  const group = acc[key] ?? [];
  return { ...acc, [key]: [...group, item] };
}, {});

export default groupBy;
