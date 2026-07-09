export class UserResponse {
  user: string;

  constructor(user: string) {
    this.user = user;
  }

  static fromArray(arr: string[]): UserResponse[] {
    return arr.map((user) => new UserResponse(user));
  }
}
