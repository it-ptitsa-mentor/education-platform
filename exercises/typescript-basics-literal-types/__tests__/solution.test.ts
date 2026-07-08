// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { startGame } from "../solution.ts";

describe("typescript-basics-literal-types: startGame()", () => {
  it("initializes with turtle at position 0", () => {
    const { state } = startGame();
    expect(state[0]).toBe('turtle');
    expect(state.slice(1)).toEqual([null, null, null, null]);
  });
  it("moves turtle right", () => {
    const { makeTurn, state } = startGame();
    makeTurn('right');
    makeTurn('right');
    expect(state[2]).toBe('turtle');
    expect(state[0]).toBeNull();
  });
  it("throws when move is impossible", () => {
    const { makeTurn } = startGame();
    expect(() => makeTurn('left')).toThrow();
  });
  it("throws when moving past right edge", () => {
    const { makeTurn } = startGame();
    makeTurn('right'); makeTurn('right'); makeTurn('right'); makeTurn('right');
    expect(() => makeTurn('right')).toThrow();
  });
});
