var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var dataClient = require('./tcp/data_client');
var commandClient = require('./tcp/command_client');
var mapDownloader = require('./utils/map_downloader');
var ppmConverter = require('./utils/ppm_converter');

var dataRouter = require('./routes/data');
var videoRouter = require('./routes/video');
var commandRouter = require('./routes/command');


// Global data
global.globalData = {
    pos: [],
    mot: [],
    batt: [],
    data: []
};
global.commandTCP = undefined;
global.dataTCP = undefined;

// TCP Client
global.missionFilePath = '/home/user/BathyBoatMissions/mission.json';
global.rosIP = '192.168.0.47';
dataClient();
commandClient();

// Express App
var app = express();
app.use(mapDownloader);
app.use(ppmConverter);
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

// Routers
app.use(dataRouter);
app.use(videoRouter);
app.use(commandRouter);

app.listen(29201);