export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T {
    if (this.items.length === 0) {
      throw new Error('Queue is empty');
    }
    return this.items.shift() as T;
  }
}
