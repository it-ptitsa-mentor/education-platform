export class MyArray<T> {
  items: T[] = [];

  push(item: T): number {
    return this.items.push(item);
  }

  filter(fn: (value: T, index: number, array: T[]) => boolean): MyArray<T> {
    const result = new MyArray<T>();
    result.items = this.items.filter(fn);
    return result;
  }
}
