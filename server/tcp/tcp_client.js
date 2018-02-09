var net = require('net');


module.exports = function(name, ip, port, receiveCallback) {
    this.initConnection = function(tcp) {
        tcp.client.connect(tcp.ip, tcp.port);
    };

    this.client.on('data', {tcp: this}, function(data) {
        e.data.tcp.readBuffer += data;
        var msg = e.data.tcp.readBuffer.split('\n');
        for (var i = 0; i < msg.length - 1; i++) {
            e.data.tcp.receiveCallback(msg[i]);
        }
        e.data.tcp.readBuffer = msg[msg.length - 1];
    });

    this.client.on('connect', {tcp: this}, function(e) {
        console.log('TCP client ' + e.data.tcp.name + ' connected');
    });

    this.client.on('close', {tcp: this}, function(had_error) {
        setTimeout(e.data.tcp.initConnection, 500, e.data.tcp);
    });

    this.name = name;
    this.ip = ip;
    this.port = port;
    this.receiveCallback = receiveCallback;

    this.readBuffer = '';

    this.client = new net.Socket();
    this.client.setEncoding('utf8');
    this.client.connect(this.ip, this.port);
};