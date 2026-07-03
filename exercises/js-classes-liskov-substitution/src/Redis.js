// Хранилище Redis (уже реализовано, эмуляция)
export default class Redis {
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
