var net = require('net');

var client = new net.Socket();
client.setEncoding('utf8');
var connected = false;

function initConnection() {
    client.connect(29200, '192.168.0.11');
}

client.on('connect', function() {
    console.log('Connected');
    connected = true;
});

client.on('close', function(had_error) {
    console.log('Connection closed: ' + had_error);
    connected = false;
});

client.on('error', function() {
    console.log('Error');
});

initConnection();
module.exports = client;