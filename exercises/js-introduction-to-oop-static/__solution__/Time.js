class Time {
  static fromString(string) {
    const [hours, minutes] = string.split(':').map(Number);
    return new Time(hours, minutes);
  }

  constructor(hours, minutes) {
    this.hours = hours;
    this.minutes = minutes;
  }

  toString() {
    return `${this.hours}:${this.minutes}`;
  }
}

export default Time;
