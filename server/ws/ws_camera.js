var fs = require('fs');
var http = require('http');
var ws = require('ws');


exports.initWebSocket = function() {
    var socketServer = new ws.Server({port: config.web.camera.webSocketPort, perMessageDeflate: false});
    socketServer.connectionCount = 0;
    socketServer.on('connection', function(socket) {
        socketServer.connectionCount++;
        socket.on('close', function(){
            socketServer.connectionCount--;
        });
    });
    socketServer.broadcast = function(data) {
        socketServer.clients.forEach(function each(client) {
            if (client.readyState === ws.OPEN) {
                client.send(data);
            }
        });
    };

    http.createServer( function(request, response) {
        response.connection.setTimeout(0);
        request.on('data', function(data){
            socketServer.broadcast(data);
            if (request.socket.recording) {
                request.socket.recording.write(data);
            }
        });
        request.on('end',function(){
            if (request.socket.recording) {
                request.socket.recording.close();
            }
        });

        if (config.web.camera.record && config.web.camera.record.enable) {
            var now = new Date();
            var fileName = config.web.camera.record.name.replace('{DATE}', now.toLocaleDateString()).replace('{TIME}', now.toLocaleTimeString());
            var path = config.web.camera.record.path + fileName;
            request.socket.recording = fs.createWriteStream(path);
        }
    }).listen(config.web.camera.streamPort);
};
