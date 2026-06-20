const s: MySet<number> = ...;
// Добавление возвращает количество элементов
s.add(1); // 1
s.add(10); // 2

s.has(1); // true
s.has(8); // false