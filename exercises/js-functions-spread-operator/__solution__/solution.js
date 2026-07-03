const convert = (...dates) => dates.map(
  ([year, month, day]) => new Date(year, month - 1, day).toDateString(),
);

export default convert;
