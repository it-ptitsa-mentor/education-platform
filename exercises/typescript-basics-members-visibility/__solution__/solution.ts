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

export class ImageFile extends File {
  private width: number;
  private height: number;

  constructor({
    name,
    size,
    width,
    height,
  }: {
    name: string;
    size: number;
    width: number;
    height: number;
  }) {
    super({ name, size });
    this.width = width;
    this.height = height;
  }

  toString(): string {
    return `${super.toString()} ${this.width}x${this.height}`;
  }
}
