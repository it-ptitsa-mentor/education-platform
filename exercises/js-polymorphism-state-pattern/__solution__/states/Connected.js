export default class Connected {
  constructor(connection) {
    this.connection = connection;
  }

  getName() {
    return 'connected';
  }

  connect() {
    throw new Error('Connection has already been established');
  }

  disconnect() {
    this.connection.toDisconnected();
  }

  write(data) {
    return data;
  }
}
