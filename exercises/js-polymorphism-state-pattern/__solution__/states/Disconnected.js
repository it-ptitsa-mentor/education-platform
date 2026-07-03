export default class Disconnected {
  constructor(connection) {
    this.connection = connection;
  }

  getName() {
    return 'disconnected';
  }

  connect() {
    this.connection.toConnected();
  }

  disconnect() {
    throw new Error('Connection has not been established');
  }

  write() {
    throw new Error('Connection has not been established');
  }
}
