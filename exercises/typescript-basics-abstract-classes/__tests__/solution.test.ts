// Рукописный тест (куки Hexlet отсутствуют, оригинальный тест недоступен)
import { describe, expect, it } from "vitest";
import { Clock } from "../solution.ts";

class Clock24 extends Clock {
  render(): string {
    return `${this.hours.toString().padStart(2, "0")} : ${this.minutes.toString().padStart(2, "0")}`;
  }
}

class Clock12 extends Clock {
  render(): string {
    const timeType =
      this.hours * 1000 + this.minutes + this.seconds < 12000 ? "AM" : "PM";
    const currentHour = this.hours % 12;
    return `${currentHour.toString().padStart(2, "0")} : ${this.minutes.toString().padStart(2, "0")} ${timeType}`;
  }
}

describe("typescript-basics-abstract-classes: Clock", () => {
  it("Clock24 renders time in 24h format", () => {
    const clock = new Clock24(23, 59, 59);
    expect(clock.render()).toBe("23 : 59");
    clock.tick();
    expect(clock.render()).toBe("00 : 00");
  });

  it("tick increments seconds and carries over to minutes/hours", () => {
    const clock = new Clock24(0, 0, 58);
    clock.tick();
    expect(clock.render()).toBe("00 : 00");
    clock.tick();
    expect(clock.render()).toBe("00 : 01");
  });

  it("Clock12 renders time in 12h format", () => {
    const clock = new Clock12(23, 59, 59);
    expect(clock.render()).toBe("11 : 59 PM");
    clock.tick();
    expect(clock.render()).toBe("00 : 00 AM");
  });

  it("hours wrap at 24", () => {
    const clock = new Clock24(23, 59, 59);
    clock.tick();
    expect(clock.render()).toBe("00 : 00");
  });
});
