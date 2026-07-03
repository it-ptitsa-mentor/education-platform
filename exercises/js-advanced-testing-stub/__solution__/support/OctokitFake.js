export default class OctokitFake {
  constructor(data) {
    this.repos = {
      listForUser: async () => ({ data }),
    };
  }
}
