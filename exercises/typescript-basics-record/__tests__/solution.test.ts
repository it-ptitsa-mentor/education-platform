// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { createAccessChecker } from "../solution.ts";

type UserRole = "admin" | "user" | "guest";
type UserResource = "document" | "user" | "adminPanel";

const userRolePermissions: Record<UserRole, Array<UserResource>> = {
  admin: ["document", "user", "adminPanel"],
  user: ["document", "user"],
  guest: ["document"],
};

describe("typescript-basics-record: createAccessChecker()", () => {
  it("allows access to permitted resources", () => {
    const checkAccess =
      createAccessChecker<UserRole, UserResource>(userRolePermissions);
    expect(checkAccess("admin", "adminPanel")).toBe(true);
    expect(checkAccess("user", "document")).toBe(true);
    expect(checkAccess("guest", "document")).toBe(true);
  });

  it("denies access to forbidden resources", () => {
    const checkAccess =
      createAccessChecker<UserRole, UserResource>(userRolePermissions);
    expect(checkAccess("user", "adminPanel")).toBe(false);
    expect(checkAccess("guest", "user")).toBe(false);
    expect(checkAccess("guest", "adminPanel")).toBe(false);
  });
});
