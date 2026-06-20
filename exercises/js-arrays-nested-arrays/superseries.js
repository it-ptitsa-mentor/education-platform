import getSuperSeriesWinner from './superseries.js'
// Первое число – сколько забила Канада
// Второе число – сколько забила СССР
const scores = [
  [3, 7], // Первая игра
  [4, 1], // Вторая игра
  [4, 4],
  [3, 5],
  [4, 5],
  [3, 2],
  [4, 3],
  [6, 5],
]

getSuperSeriesWinner(scores) // 'canada'