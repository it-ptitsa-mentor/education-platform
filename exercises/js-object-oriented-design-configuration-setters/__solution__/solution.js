export default class Truncater {
  static defaultOptions = {
    length: 200,
    separator: '...',
  };

  constructor(options = {}) {
    this.options = { ...Truncater.defaultOptions, ...options };
  }

  truncate(text, options = {}) {
    const { length, separator } = { ...this.options, ...options };
    if (text.length <= length) {
      return text;
    }
    return `${text.substring(0, length)}${separator}`;
  }
}
