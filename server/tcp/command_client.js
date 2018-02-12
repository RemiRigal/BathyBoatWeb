var tcpClient = require('./tcp_client');


var client;

module.exports = function() {
    client = tcpClient('Command', rosIP, 22300, onDataReceived);
};

function onDataReceived(msg) {

}

