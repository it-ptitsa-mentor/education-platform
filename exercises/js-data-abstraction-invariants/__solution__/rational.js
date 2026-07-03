export const getGcd = (a, b) => (b === 0 ? Math.abs(a) : getGcd(b, a % b));

export const makeRational = (numer, denom) => {
  const gcd = getGcd(numer, denom);
  const sign = denom < 0 ? -1 : 1;
  return {
    numer: (sign * numer) / gcd,
    denom: (sign * denom) / gcd,
  };
};

export const getNumer = (rat) => rat.numer;

export const getDenom = (rat) => rat.denom;

export const ratToString = (rat) => `${getNumer(rat)}/${getDenom(rat)}`;

export const add = (rat1, rat2) => makeRational(
  (getNumer(rat1) * getDenom(rat2)) + (getNumer(rat2) * getDenom(rat1)),
  getDenom(rat1) * getDenom(rat2),
);

export const sub = (rat1, rat2) => makeRational(
  (getNumer(rat1) * getDenom(rat2)) - (getNumer(rat2) * getDenom(rat1)),
  getDenom(rat1) * getDenom(rat2),
);
