import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const exerciseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("css-content-media", () => {
  it("index.html contains html markup", () => {
    const html = readFileSync(path.join(exerciseDir, "index.html"), "utf8").toLowerCase();
    expect(html).toMatch(/<html|<!doctype|<body|<div|<main|<section/);
  });
});
