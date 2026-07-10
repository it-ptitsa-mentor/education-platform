// @ts-check

const numbers = [1, 3, 8, 9, 100, 23, 55, 34]

const getEvenNumbers = (): number[] => numbers.filter((n) => n % 2 === 0)

export default getEvenNumbers
