// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { File } from "../solution.ts";

describe("typescript-basics-class-fields: File", () => {
  it("creates a file with name and size", () => {
    const file = new File({ name: "open-world.jpeg", size: 1000 });
    expect(file.name).toBe("open-world.jpeg");
    expect(file.size).toBe(1000);
  });

  it("toString returns formatted string", () => {
    const file = new File({ name: "open-world.jpeg", size: 1000 });
    expect(file.toString()).toBe("open-world.jpeg (1000 bytes)");
  });

  it("template literal uses toString", () => {
    const file = new File({ name: "test.txt", size: 512 });
    expect(`${file}`).toBe("test.txt (512 bytes)");
  });
});
