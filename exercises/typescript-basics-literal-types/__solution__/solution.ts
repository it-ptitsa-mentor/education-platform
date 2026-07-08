type Direction = 'left' | 'right';
type Cell = 'turtle' | null;

export const startGame = () => {
  const state: Cell[] = ['turtle', null, null, null, null];
  let position = 0;

  const makeTurn = (direction: Direction): void => {
    const next = direction === 'right' ? position + 1 : position - 1;
    if (next < 0 || next >= state.length) {
      throw new Error(`Cannot move ${direction}`);
    }
    state[position] = null;
    position = next;
    state[position] = 'turtle';
  };

  return { makeTurn, state };
};
