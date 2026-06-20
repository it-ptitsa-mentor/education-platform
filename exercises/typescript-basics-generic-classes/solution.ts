const queue = new Queue<number>();
queue.enqueue(1);
queue.dequeue(); // 1
queue.dequeue(); // Error: Queue is empty