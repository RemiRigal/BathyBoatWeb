var tcpClient = require('./tcp_client');


module.exports = function() {
    commandTCP = new tcpClient('Command', rosIP, 22300, onDataReceived);
};

function onDataReceived(msg) {

}

