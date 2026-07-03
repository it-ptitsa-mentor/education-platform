export default class InMemoryKV {
  constructor(initialData = {}) {
    this.map = { ...initialData };
  }

  get(key, defaultValue = null) {
    return Object.hasOwn(this.map, key) ? this.map[key] : defaultValue;
  }

  set(key, value) {
    this.map[key] = value;
  }

  unset(key) {
    delete this.map[key];
  }

  toObject() {
    return { ...this.map };
  }
}
