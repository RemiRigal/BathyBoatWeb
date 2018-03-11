var tcpClient = require('./tcp_client');


module.exports = function() {
    commandTCP = new tcpClient('Command', config.web.webServer.rosIP, config.common.tcp.commandPort, onDataReceived);
};

function onDataReceived(msg) {

}

