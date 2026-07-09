// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { Queue } from "../solution.ts";

describe("typescript-basics-generic-classes: Queue", () => {
  it("enqueues and dequeues in FIFO order", () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
  });

  it("throws Error when dequeuing from empty queue", () => {
    const queue = new Queue<number>();
    expect(() => queue.dequeue()).toThrow(Error);
  });

  it("works with strings", () => {
    const queue = new Queue<string>();
    queue.enqueue("hello");
    queue.enqueue("world");
    expect(queue.dequeue()).toBe("hello");
  });
});
