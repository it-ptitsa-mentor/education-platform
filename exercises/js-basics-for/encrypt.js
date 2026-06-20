encrypt('move') // 'omev'
encrypt('attack') // 'taatkc'
encrypt('car!') // 'ac!r'

// Если длина строки нечётная,
// то последний символ остаётся на своём месте
encrypt('go!') // 'og!'