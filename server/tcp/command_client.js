var tcpClient = require('./tcp_client');


module.exports = function() {
    commandTCP = new tcpClient('Command', config.webServer.rosIP, config.tcp.commandPort, onDataReceived);
};

function onDataReceived(msg) {

}

