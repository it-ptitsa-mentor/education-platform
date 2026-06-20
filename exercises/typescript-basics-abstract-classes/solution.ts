// 24-часовой формат
class Clock24 extends Clock {
  render(): string {
    return `${this.hours.toString().padStart(2, '0')} : ${this.minutes.toString().padStart(2, '0')}`;
  }
}

const clock24 = new Clock24(23, 59, 59);
console.log(clock24.render()); // => '23 : 59'
clock24.tick();
console.log(clock24.render()); // => '00 : 00'

// 12-часовой формат
class Clock12 extends Clock {
  render(): string {
    const timeType = this.hours * 1000 + this.minutes + this.seconds < 12000 ? 'AM' : 'PM';
    const currentHour = this.hours % 12;
    return `${currentHour.toString().padStart(2, '0')} : ${this.minutes.toString().padStart(2, '0')} ${timeType}`;
  }
}

const clock12 = new Clock12(23, 59, 59);
console.log(clock12.render()); // => '11 : 59 PM'
clock12.tick();
console.log(clock12.render()); // => '00 : 00 AM'