export type Entry = { [name: string]: number };

export interface IPhonebook {
  readonly entries: Entry;
  get(name: string): number | null;
  set(name: string, phone: number): void;
}

export class Phonebook implements IPhonebook {
  readonly entries: Entry = {};

  get(name: string): number | null {
    return this.entries[name] !== undefined ? this.entries[name] : null;
  }

  set(name: string, phone: number): void {
    (this.entries as Entry)[name] = phone;
  }
}
