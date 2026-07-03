const make = (numer = 0, denom = 1) => ({
  numer,
  denom,
  setNumer(value) {
    this.numer = value;
  },
  setDenom(value) {
    this.denom = value;
  },
  getNumer() {
    return this.numer;
  },
  getDenom() {
    return this.denom;
  },
  toString() {
    return `${this.numer}/${this.denom}`;
  },
  add(rational) {
    return make(
      (this.getNumer() * rational.getDenom()) + (this.getDenom() * rational.getNumer()),
      this.getDenom() * rational.getDenom(),
    );
  },
});

export default make;
