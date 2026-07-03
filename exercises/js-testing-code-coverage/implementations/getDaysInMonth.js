// Функция, которую нужно покрыть тестами (уже реализована)
const getDaysInMonth = (month, year) => {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }
  if (month === 2) {
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return isLeap ? 29 : 28;
  }
  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonths[month - 1];
};

export default getDaysInMonth;
