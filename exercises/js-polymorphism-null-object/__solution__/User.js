import FakeSubscription from './FakeSubscription.js';

const admins = ['rakhim@hexlet.io'];

export default class User {
  constructor(email, subscription = null) {
    this.email = email;
    this.subscription = subscription ?? new FakeSubscription(this);
  }

  isAdmin() {
    return admins.includes(this.email);
  }

  getCurrentSubscription() {
    return this.subscription;
  }
}
