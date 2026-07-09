export interface IBird {
  fly(): void;
}

export interface IPlane {
  land(): void;
}

export interface ISuperman extends IBird, IPlane {
  guessWho(value: string): string;
}

export const superman: ISuperman = {
  fly() {},
  land() {},
  guessWho(value: string): string {
    if (value.toLowerCase() === 'superman') {
      return `It's a ${value}!`;
    }
    return `It's a ${value}?`;
  },
};
