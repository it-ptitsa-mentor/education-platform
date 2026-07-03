import HTMLElement from './HTMLElement.js';

export default class HTMLHrElement extends HTMLElement {
  toString() {
    return `<hr${this.stringifyAttributes()}>`;
  }
}
