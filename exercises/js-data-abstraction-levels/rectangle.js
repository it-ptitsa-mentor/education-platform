// Создание прямоугольника:
// p - левая верхняя точка
// 4 - ширина
// 5 - высота
//
// p    4
// -----------
// |         |
// |         | 5
// |         |
// -----------

p = makeDecartPoint(0, 1)
rectangle = makeRectangle(p, 4, 5)

containsOrigin(rectangle) // false
getWidth(rectangle) // 4

rectangle2 = makeRectangle(makeDecartPoint(-4, 3), 5, 4)
containsOrigin(rectangle2) // true