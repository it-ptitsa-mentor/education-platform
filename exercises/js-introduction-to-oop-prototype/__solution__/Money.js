const rates = {
  usd: { usd: 1, eur: 0.7 },
  eur: { eur: 1, usd: 1.2 },
};

function Money(value, currency = 'usd') {
  this.value = value;
  this.currency = currency;
}

Money.prototype.getValue = function getValue() {
  return this.value;
};

Money.prototype.getCurrency = function getCurrency() {
  return this.currency;
};

Money.prototype.exchangeTo = function exchangeTo(currency) {
  return new Money(this.value * rates[this.currency][currency], currency);
};

Money.prototype.add = function add(money) {
  const exchanged = money.exchangeTo(this.currency);
  return new Money(this.value + exchanged.getValue(), this.currency);
};

Money.prototype.format = function format() {
  return this.value.toLocaleString('en-US', {
    style: 'currency',
    currency: this.currency,
  });
};

export default Money;
