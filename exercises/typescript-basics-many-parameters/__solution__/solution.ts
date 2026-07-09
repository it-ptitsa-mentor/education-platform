export class MyMap<K, V> {
  values: Map<K, V> = new Map();

  set(key: K, value: V): this {
    this.values.set(key, value);
    return this;
  }

  get(key: K): V | undefined {
    return this.values.get(key);
  }
}
