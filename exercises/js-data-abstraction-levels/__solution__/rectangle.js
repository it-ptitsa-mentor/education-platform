export const makeDecartPoint = (x, y) => ({ x, y });
export const getX = (point) => point.x;
export const getY = (point) => point.y;

export const makeRectangle = (point, width, height) => ({ point, width, height });

export const getStartPoint = (rectangle) => rectangle.point;

export const getWidth = (rectangle) => rectangle.width;

export const getHeight = (rectangle) => rectangle.height;

export const containsOrigin = (rectangle) => {
  const startPoint = getStartPoint(rectangle);
  const left = getX(startPoint);
  const top = getY(startPoint);
  const right = left + getWidth(rectangle);
  const bottom = top - getHeight(rectangle);
  return left < 0 && right > 0 && bottom < 0 && top > 0;
};
