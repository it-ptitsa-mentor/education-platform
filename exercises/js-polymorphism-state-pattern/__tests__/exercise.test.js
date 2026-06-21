import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("js-polymorphism-state-pattern", () => {
  it("TcpConnection.js", () => {
    const content = readFileSync(path.join(exerciseDir, "TcpConnection.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("states/Connected.js", () => {
    const content = readFileSync(path.join(exerciseDir, "states/Connected.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it("states/Disconnected.js", () => {
    const content = readFileSync(path.join(exerciseDir, "states/Disconnected.js"), "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});
