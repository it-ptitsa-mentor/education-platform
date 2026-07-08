// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { addAdmin } from "../solution.ts";

describe("typescript-basics-intersection-types: addAdmin()", () => {
  it("adds admin permission to user", () => {
    const user = { login: 'login1' };
    const admin = addAdmin(user);
    expect(admin.login).toBe('login1');
    expect(admin.permission).toBeDefined();
  });
  it("preserves user properties", () => {
    const user = { login: 'user2' };
    const admin = addAdmin(user);
    expect(admin.login).toBe('user2');
  });
});
