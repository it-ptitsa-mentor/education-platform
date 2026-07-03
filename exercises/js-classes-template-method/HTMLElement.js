// Базовый класс (уже реализован)
export default class HTMLElement {
  constructor(attributes = {}) {
    this.attributes = attributes;
  }

  stringifyAttributes() {
    return Object.entries(this.attributes)
      .map(([name, value]) => ` ${name}="${value}"`)
      .join('');
  }
}
