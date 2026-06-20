import isBracketStructureBalanced from './strings.js'

// Пример вложенности
isBracketStructureBalanced('(>') // false
isBracketStructureBalanced('()') // true
isBracketStructureBalanced('[()]') // true
isBracketStructureBalanced('({}[])') // true
isBracketStructureBalanced('{<>}}') // false
isBracketStructureBalanced('([)]') // false