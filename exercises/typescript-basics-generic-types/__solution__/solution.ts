export class MySet<T> {
  items: T[] = [];

  add(item: T): number {
    if (!this.has(item)) {
      this.items.push(item);
    }
    return this.items.length;
  }

  has(item: T): boolean {
    return this.items.includes(item);
  }
}
