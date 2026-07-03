// Класс конфигурации (уже реализован)
export default class Config {
  constructor(data) {
    this.data = data;
  }

  getValue(key) {
    return this.data[key];
  }
}
