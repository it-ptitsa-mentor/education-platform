export const makeDecartPoint = (x, y) => ({ x, y });
export const getX = (point) => point.x;
export const getY = (point) => point.y;

export const makeSegment = (beginPoint, endPoint) => ({ beginPoint, endPoint });

export const getBeginPoint = (segment) => segment.beginPoint;

export const getEndPoint = (segment) => segment.endPoint;

export const getMidpointOfSegment = (segment) => {
  const begin = getBeginPoint(segment);
  const end = getEndPoint(segment);
  return makeDecartPoint(
    (getX(begin) + getX(end)) / 2,
    (getY(begin) + getY(end)) / 2,
  );
};
