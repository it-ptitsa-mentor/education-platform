import { describe, expect, it } from "vitest";

const loadClass = async () => {
  const mod = await import("../Money.js");
  const Money = mod.default ?? mod.Money;
  if (typeof Money !== "function") {
    throw new Error("Экспортируйте конструктор Money (export default)");
  }
  return Money;
};

describe("js-introduction-to-oop-prototype", () => {
  it("хранит значение и валюту, usd по умолчанию", async () => {
    const Money = await loadClass();
    const money = new Money(100);
    expect(money.getValue()).toBe(100);
    expect(money.getCurrency()).toBe("usd");
    expect(new Money(200, "eur").getCurrency()).toBe("eur");
  });

  it("конвертирует валюты", async () => {
    const Money = await loadClass();
    expect(new Money(100).exchangeTo("eur").getValue()).toBe(70);
    expect(new Money(100, "eur").exchangeTo("usd").getValue()).toBe(120);
  });

  it("складывает деньги с конвертацией", async () => {
    const Money = await loadClass();
    const money1 = new Money(100);
    const money2 = new Money(200, "eur");
    const money3 = money2.add(money1);
    expect(money3.getValue()).toBe(270);
    expect(money3.getCurrency()).toBe("eur");
    expect(money3.add(money1).getValue()).toBe(340);
  });

  it("форматирует вывод", async () => {
    const Money = await loadClass();
    expect(new Money(100).format()).toBe("$100.00");
    expect(new Money(200, "eur").format()).toBe("€200.00");
    expect(new Money(10000).format()).toBe("$10,000.00");
  });
});
