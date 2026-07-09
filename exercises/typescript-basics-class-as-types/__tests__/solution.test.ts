// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { File } from "../solution.ts";

describe("typescript-basics-class-as-types: File", () => {
  it("creates a file from an object", () => {
    const file = new File({ name: "open-world.jpeg", size: 1000 });
    expect(`${file}`).toBe("open-world.jpeg (1000 bytes)");
  });

  it("marks file as copy when created from another File", () => {
    const file1 = new File({ name: "open-world.jpeg", size: 1000 });
    const file2 = new File(file1);
    expect(`${file2}`).toBe("(copy) open-world.jpeg (1000 bytes)");
  });

  it("copy of copy is also a copy", () => {
    const file1 = new File({ name: "open-world.jpeg", size: 1000 });
    const file2 = new File(file1);
    const file3 = new File(file2);
    expect(`${file3}`).toBe("(copy) open-world.jpeg (1000 bytes)");
  });
});
