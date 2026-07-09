export abstract class Clock {
  protected hours: number;
  protected minutes: number;
  protected seconds: number;

  constructor(hours: number, minutes: number, seconds: number) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  tick(): void {
    this.seconds += 1;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes += 1;
    }
    if (this.minutes >= 60) {
      this.minutes = 0;
      this.hours += 1;
    }
    if (this.hours >= 24) {
      this.hours = 0;
    }
  }

  abstract render(): string;
}
