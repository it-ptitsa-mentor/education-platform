// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { applyTransactions } from "../solution.ts";
import type { Wallet } from "../solution.ts";

describe("typescript-basics-variability: applyTransactions()", () => {
  it("applies transactions to balance", () => {
    const wallet: Wallet = {
      balance: 0,
      transactions: [{ apply: (amount) => amount + 1 }],
    };
    expect(applyTransactions(wallet)).toBe(1);
  });
  it("applies multiple transactions", () => {
    const wallet: Wallet = {
      balance: 10,
      transactions: [
        { apply: (a) => a + 5 },
        { apply: (a) => a * 2 },
      ],
    };
    expect(applyTransactions(wallet)).toBe(30);
  });
  it("returns original balance if a transaction throws", () => {
    const wallet: Wallet = {
      balance: 100,
      transactions: [
        { apply: () => { throw new Error('fail'); } },
      ],
    };
    expect(applyTransactions(wallet)).toBe(100);
  });
});
