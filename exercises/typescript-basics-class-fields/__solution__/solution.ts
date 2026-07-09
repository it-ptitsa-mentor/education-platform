export class File {
  name: string;
  size: number;

  constructor({ name, size }: { name: string; size: number }) {
    this.name = name;
    this.size = size;
  }

  toString(): string {
    return `${this.name} (${this.size} bytes)`;
  }
}
