import { describe, expect, it } from "vitest";

const loadAll = async () => {
  const Node = (await import("../Node.js")).default;
  const reverse = (await import("../linkedList.js")).default;
  if (typeof reverse !== "function") {
    throw new Error("Экспортируйте функцию reverse (export default)");
  }
  return { Node, reverse };
};

const toArray = (list) => {
  const result = [];
  let current = list;
  while (current !== null) {
    result.push(current.getValue());
    current = current.getNext();
  }
  return result;
};

describe("js-polymorphism-parametric-polymorphism", () => {
  it("переворачивает список чисел", async () => {
    const { Node, reverse } = await loadAll();
    const numbers = new Node(1, new Node(2, new Node(3)));
    expect(toArray(reverse(numbers))).toEqual([3, 2, 1]);
  });

  it("работает с любыми типами данных", async () => {
    const { Node, reverse } = await loadAll();
    const strings = new Node("a", new Node("b"));
    expect(toArray(reverse(strings))).toEqual(["b", "a"]);

    const single = new Node(42);
    expect(toArray(reverse(single))).toEqual([42]);
  });
});
