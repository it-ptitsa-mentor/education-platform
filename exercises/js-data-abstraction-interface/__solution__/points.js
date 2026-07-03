export const makePoint = (x, y) => ({
  angle: Math.atan2(y, x),
  radius: Math.sqrt((x ** 2) + (y ** 2)),
});

export const getX = (point) => Math.round(point.radius * Math.cos(point.angle));

export const getY = (point) => Math.round(point.radius * Math.sin(point.angle));
