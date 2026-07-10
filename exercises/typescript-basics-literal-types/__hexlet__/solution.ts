type Turtle = 'turtle' | null

type Game = {
  makeTurn: (direction: 'left' | 'right') => void
  state: Array<Turtle>
}

const startGame = (): Game => {
  const state: Array<Turtle> = ['turtle', null, null, null, null]

  // BEGIN (write your solution here)
  
  // END

  return { makeTurn, state }
}

export default startGame
