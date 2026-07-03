// Хранилище в памяти (уже реализовано)
export default class InMemory {
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
    return Object.keys(this.data).length;
  }
}
