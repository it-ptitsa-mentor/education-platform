// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import {
  HttpError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "../solution.ts";

describe("typescript-basics-class-extending: HttpError hierarchy", () => {
  it("NotFoundError has status 404", () => {
    const error = new NotFoundError("Not Found");
    expect(error.status).toBe(404);
    expect(error.message).toBe("Not Found");
    expect(error instanceof Error).toBe(true);
    expect(error instanceof HttpError).toBe(true);
  });

  it("UnauthorizedError has status 401", () => {
    const error = new UnauthorizedError("Unauthorized");
    expect(error.status).toBe(401);
    expect(error.message).toBe("Unauthorized");
  });

  it("ForbiddenError has status 403", () => {
    const error = new ForbiddenError("Forbidden");
    expect(error.status).toBe(403);
    expect(error.message).toBe("Forbidden");
  });

  it("HttpError stores status and message", () => {
    const error = new HttpError(500, "Server Error");
    expect(error.status).toBe(500);
    expect(error.message).toBe("Server Error");
  });
});
