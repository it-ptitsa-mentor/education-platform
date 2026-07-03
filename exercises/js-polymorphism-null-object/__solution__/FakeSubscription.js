export default class FakeSubscription {
  constructor(user) {
    this.user = user;
  }

  hasPremiumAccess() {
    return this.user.isAdmin();
  }

  hasProfessionalAccess() {
    return this.user.isAdmin();
  }
}
