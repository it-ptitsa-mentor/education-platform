const normalize = (lesson) => {
  const name = lesson.name.toLowerCase();
  lesson.name = `${name[0].toUpperCase()}${name.slice(1)}`;
  lesson.description = lesson.description.toLowerCase();
};

export default normalize;
