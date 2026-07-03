export default class Url {
  constructor(address) {
    this.url = new URL(address);
  }

  getScheme() {
    return this.url.protocol.slice(0, -1);
  }

  getHostName() {
    return this.url.hostname;
  }

  getQueryParams() {
    return Object.fromEntries(this.url.searchParams);
  }

  getQueryParam(name, defaultValue = null) {
    return this.url.searchParams.get(name) ?? defaultValue;
  }

  equals(url) {
    return this.getScheme() === url.getScheme()
      && this.getHostName() === url.getHostName()
      && JSON.stringify(this.getQueryParams()) === JSON.stringify(url.getQueryParams());
  }
}
