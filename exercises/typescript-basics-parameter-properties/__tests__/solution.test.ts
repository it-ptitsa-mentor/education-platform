// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { CustomFile } from "../solution.ts";

describe("typescript-basics-parameter-properties: CustomFile", () => {
  it("stores name and size via parameter properties", () => {
    const file = new CustomFile("open-world.jpeg", 1000);
    expect(file.name).toBe("open-world.jpeg");
    expect(file.size).toBe(1000);
  });

  it("toString returns formatted string", () => {
    const file = new CustomFile("open-world.jpeg", 1000);
    expect(file.toString()).toBe("open-world.jpeg (1000 bytes)");
  });

  it("template literal uses toString", () => {
    const file = new CustomFile("data.csv", 256);
    expect(`${file}`).toBe("data.csv (256 bytes)");
  });
});
