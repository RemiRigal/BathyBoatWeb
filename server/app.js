var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var dataClient = require('./tcp/data_client');
var commandClient = require('./tcp/command_client');
var mapDownloader = require('./utils/map_downloader');

var dataRouter = require('./routes/data');
var videoRouter = require('./routes/video');


// Global data
global.globalData = {
    pos: [],
    mot: [],
    batt: [],
    data: []
};

// TCP Client
global.rosIP = '192.168.1.1';
dataClient();
commandClient();

// Express App
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(mapDownloader);
app.use(express.static(__dirname + '/../public'));
app.use(cors());

// Routers
app.use(dataRouter);
app.use(videoRouter);

app.listen(29201);