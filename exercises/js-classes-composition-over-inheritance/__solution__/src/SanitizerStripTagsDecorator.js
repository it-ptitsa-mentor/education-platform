const stripTags = (tagString) => tagString.replace(/<[^>]*>/g, '');

export default class SanitizerStripTagsDecorator {
  constructor(sanitizer) {
    this.sanitizer = sanitizer;
  }

  sanitize(text) {
    return this.sanitizer.sanitize(stripTags(text));
  }
}
