var net = require('net');


module.exports = function(name, ip, port, receiveCallback) {

    var tcp = this;

    this.client = new net.Socket();
    this.client.setEncoding('utf8');

    this.write = function(msg) {
        if (tcp.client.remoteAddress !== undefined && !tcp.client.destroyed && !tcp.client.connecting) {
            console.log('TCP', tcp.name, 'write: ', msg);
            tcp.client.write(msg);
        }
    };

    this.initConnection = function() {
        tcp.client.connect(tcp.port, tcp.ip);
    };

    this.client.on('data', function(data) {
        tcp.readBuffer += data;
        var msg = tcp.readBuffer.split('\n');
        for (var i = 0; i < msg.length - 1; i++) {
            tcp.receiveCallback(msg[i]);
        }
        tcp.readBuffer = msg[msg.length - 1];
    });

    this.client.on('connect', function() {
        console.log('TCP', tcp.name, 'connected');
    });

    this.client.on('error', function(e) {
        //console.log(e);
    });

    this.client.on('close', function() {
        console.log('TCP', tcp.name, 'timeout. Reconnecting...');
        setTimeout(tcp.initConnection, 5000);
    });

    this.name = name;
    this.ip = ip;
    this.port = port;
    this.receiveCallback = receiveCallback;

    this.readBuffer = '';

    console.log('TCP', this.name, 'connection');
    this.client.connect(this.port, this.ip);
};