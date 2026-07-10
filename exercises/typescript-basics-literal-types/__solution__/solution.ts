type Turtle = 'turtle' | null

type Game = {
  makeTurn: (direction: 'left' | 'right') => void
  state: Array<Turtle>
}

const startGame = (): Game => {
  const state: Array<Turtle> = ['turtle', null, null, null, null]

  const makeTurn = (direction: 'left' | 'right'): void => {
    const index = state.findIndex((cell) => cell === 'turtle')
    const nextIndex = direction === 'right' ? index + 1 : index - 1
    if (nextIndex < 0 || nextIndex >= state.length) {
      throw new Error('Out of bounds')
    }
    state[index] = null
    state[nextIndex] = 'turtle'
  }

  return { makeTurn, state }
}

export default startGame
