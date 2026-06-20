import { describe, expect, it } from "vitest";
import { isRunTestsHotkey } from "./exercise-hotkeys.js";

describe("isRunTestsHotkey", () => {
  it("matches ctrl+enter and cmd+enter", () => {
    expect(
      isRunTestsHotkey({
        key: "Enter",
        ctrlKey: true,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      }),
    ).toBe(true);
    expect(
      isRunTestsHotkey({
        key: "Enter",
        ctrlKey: false,
        metaKey: true,
        shiftKey: false,
        altKey: false,
      }),
    ).toBe(true);
  });

  it("ignores modified variants", () => {
    expect(
      isRunTestsHotkey({
        key: "Enter",
        ctrlKey: true,
        metaKey: false,
        shiftKey: true,
        altKey: false,
      }),
    ).toBe(false);
    expect(
      isRunTestsHotkey({
        key: "s",
        ctrlKey: true,
        metaKey: false,
        shiftKey: false,
        altKey: false,
      }),
    ).toBe(false);
  });
});
