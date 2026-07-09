// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { UserResponse } from "../solution.ts";

describe("typescript-basics-static-property: UserResponse", () => {
  it("fromArray creates instances with user property", () => {
    const response = UserResponse.fromArray(["user1", "user2", "user3"]);
    expect(response[0].user).toBe("user1");
    expect(response[1].user).toBe("user2");
    expect(response[2].user).toBe("user3");
  });

  it("fromArray returns instances of UserResponse", () => {
    const response = UserResponse.fromArray(["user1"]);
    expect(response[0] instanceof UserResponse).toBe(true);
  });

  it("fromArray returns correct count", () => {
    const response = UserResponse.fromArray(["a", "b", "c"]);
    expect(response.length).toBe(3);
  });

  it("fromArray with empty array returns empty array", () => {
    expect(UserResponse.fromArray([])).toEqual([]);
  });
});
