const getDistance = ([x1, y1], [x2, y2]) =>
  Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

const getTheNearestLocation = (locations, point) => {
  if (locations.length === 0) {
    return null;
  }
  let nearest = null;
  let minDistance = Infinity;
  for (const location of locations) {
    const [, coordinates] = location;
    const distance = getDistance(coordinates, point);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = location;
    }
  }
  return nearest;
};

export { getTheNearestLocation };
export default getTheNearestLocation;
