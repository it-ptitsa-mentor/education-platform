// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { superman } from "../solution.ts";

describe("typescript-basics-interface-using: superman", () => {
  it("returns question format for non-superman values", () => {
    expect(superman.guessWho("bird")).toBe("It's a bird?");
    expect(superman.guessWho("plane")).toBe("It's a plane?");
  });

  it("returns exclamation for superman (case-insensitive)", () => {
    expect(superman.guessWho("superman")).toBe("It's a superman!");
    expect(superman.guessWho("Superman")).toBe("It's a Superman!");
    expect(superman.guessWho("SUPERMAN")).toBe("It's a SUPERMAN!");
  });
});
