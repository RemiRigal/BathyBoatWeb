var tcpClient = require('./tcp_client');


var commandClient;

module.exports = function() {
    commandClient = new tcpClient('Command', rosIP, 22300, onDataReceived);
};

function onDataReceived(msg) {

}

