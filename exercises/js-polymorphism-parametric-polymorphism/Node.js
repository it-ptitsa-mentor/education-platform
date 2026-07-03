// Реализация узла односвязного списка (уже реализована)
export default class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }

  getValue() {
    return this.value;
  }

  getNext() {
    return this.next;
  }

  setNext(node) {
    this.next = node;
  }
}
