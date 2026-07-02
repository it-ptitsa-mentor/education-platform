const getWeekends = (format = 'long') => {
  if (format === 'short') {
    return ['sat', 'sun'];
  }
  return ['saturday', 'sunday'];
};

export { getWeekends };
export default getWeekends;
