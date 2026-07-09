export class File {
  name: string;
  size: number;
  private isCopy: boolean;

  constructor(arg: { name: string; size: number } | File) {
    if (arg instanceof File) {
      this.name = arg.name;
      this.size = arg.size;
      this.isCopy = true;
    } else {
      this.name = arg.name;
      this.size = arg.size;
      this.isCopy = false;
    }
  }

  toString(): string {
    return this.isCopy
      ? `(copy) ${this.name} (${this.size} bytes)`
      : `${this.name} (${this.size} bytes)`;
  }
}
