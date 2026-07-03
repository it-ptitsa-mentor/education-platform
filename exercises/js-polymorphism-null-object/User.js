const admins = ['rakhim@hexlet.io'];

export default class User {
  // Допишите конструктор: если подписка передана — используется она,
  // иначе создаётся фейковая (FakeSubscription)
  constructor(email, subscription) {
    this.email = email;
  }

  isAdmin() {
    return admins.includes(this.email);
  }

  getCurrentSubscription() {
    return this.subscription;
  }
}
