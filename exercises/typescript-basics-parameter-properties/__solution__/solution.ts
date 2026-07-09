export class CustomFile {
  constructor(
    public name: string,
    public size: number,
  ) {}

  toString(): string {
    return `${this.name} (${this.size} bytes)`;
  }
}
