let socket;
class Socket {
    init(server) {
        socket = require('socket.io')(server);
        return socket;
    }
    getSocket() {
        return socket;
    }
}

module.exports = new Socket();
