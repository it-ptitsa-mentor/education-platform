export default class User {
  constructor(name) {
    this.name = name;
  }

  getGreeting() {
    return `Hello ${this.name}!`;
  }
}
