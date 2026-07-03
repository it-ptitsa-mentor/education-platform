import Connected from './states/Connected.js';
import Disconnected from './states/Disconnected.js';

export default class TcpConnection {
  constructor(ip, port) {
    this.ip = ip;
    this.port = port;
    this.connectedState = new Connected(this);
    this.disconnectedState = new Disconnected(this);
    this.state = this.disconnectedState;
  }

  toConnected() {
    this.state = this.connectedState;
  }

  toDisconnected() {
    this.state = this.disconnectedState;
  }

  getCurrentState() {
    return this.state.getName();
  }

  connect() {
    this.state.connect();
  }

  disconnect() {
    this.state.disconnect();
  }

  write(data) {
    return this.state.write(data);
  }
}
