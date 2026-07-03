// Конструктор точки (уже реализован).
// Точка хранит данные в полярной системе координат
export const makePoint = (x, y) => ({
  angle: Math.atan2(y, x),
  radius: Math.sqrt((x ** 2) + (y ** 2)),
});

// Реализуйте и экспортируйте функции getX(point) и getY(point)
