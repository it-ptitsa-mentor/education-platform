// На вход принимаются ip-адрес и порт
connection = new TcpConnection('132.223.243.88', 2342);
connection.connect();
connection.getCurrentState(); // connected
connection.write('data');
connection.disconnect();
connection.getCurrentState(); // disconnected
// Выбрасывает исключение если нет соединения
connection.disconnect(); // Boom!