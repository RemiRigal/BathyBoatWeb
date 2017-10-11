var express = require('express');
var cors = require('cors');
var shell = require('shelljs');
var backendUtils = require('./backend_utils.js');
var bodyParser = require('body-parser');
var tcpClient = require('./tcp_client.js');

// TCP Client
var globalData = {
    pos: [],
    mot: [],
    batt: [],
    data: []
};

function onDataReceived(data) {
    switch (data.type) {
        case '$POS':
            globalData.pos.push(data);
            break;
        case '$BATT':
            globalData.batt.push(data);
            break;
        case '$MOT':
            globalData.mot.push(data);
            break;
        case '$DATA':
            globalData.data.push(data);
            break;
    }
}

var client = tcpClient(onDataReceived);


// Express App
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.get('/data', function(req, res) {
    var now = new Date();
    var update = {};

    if (req.body.lastUpdate === undefined) {
        update = globalData;
    } else {
        var lastUpdate = new Date(req.body.lastUpdate);
        update.pos = backendUtils.getLastData(globalData.pos, lastUpdate);
        update.batt = backendUtils.getLastData(globalData.batt, lastUpdate);
        update.mot = backendUtils.getLastData(globalData.mot, lastUpdate);
        update.data = backendUtils.getLastData(globalData.data, lastUpdate);
    }

    update.newUpdate = now;
    res.send(JSON.stringify(update));
});

app.post('/video', function(req, res) {

    if (req.body.action === 'enable') {
        console.log('Starting capture');
        shell.exec('pm2 start video-capture');
    } else {
        console.log('Stopping capture');
        shell.exec('pm2 stop video-capture');
    }
    console.log(new Date(new Date() - new Date(req.body.time)));
});

app.listen(29201);