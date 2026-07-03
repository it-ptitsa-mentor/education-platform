export default class GoogleStorage {
  constructor() {
    this.data = {};
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }

  count() {
    throw new Error('GoogleStorage does not support count()');
  }
}
