// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { ImageFile, File } from "../solution.ts";

describe("typescript-basics-members-visibility: ImageFile", () => {
  it("toString includes name, size and dimensions", () => {
    const imageFile = new ImageFile({
      name: "image.png",
      size: 100,
      width: 200,
      height: 300,
    });
    expect(imageFile.toString()).toBe("image.png (100 bytes) 200x300");
  });

  it("inherits from File", () => {
    const imageFile = new ImageFile({
      name: "photo.jpg",
      size: 500,
      width: 1920,
      height: 1080,
    });
    expect(imageFile instanceof File).toBe(true);
    expect(imageFile.name).toBe("photo.jpg");
    expect(imageFile.size).toBe(500);
  });
});
