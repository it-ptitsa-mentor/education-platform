import HTMLElement from './HTMLElement.js';

export default class HTMLPairElement extends HTMLElement {
  constructor(attributes = {}) {
    super(attributes);
    this.body = '';
  }

  setTextContent(body) {
    this.body = body;
  }

  getTextContent() {
    return this.body;
  }

  getTagName() {
    throw new Error('Method getTagName() must be implemented in a subclass');
  }

  toString() {
    const tagName = this.getTagName();
    return `<${tagName}${this.stringifyAttributes()}>${this.getTextContent()}</${tagName}>`;
  }
}
