var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var yaml = require('js-yaml');
var fs = require('fs');

var dataClient = require('./tcp/data_client');
var commandClient = require('./tcp/command_client');
var mapDownloader = require('./utils/map_downloader');
var ppmConverter = require('./utils/ppm_converter');
var wsCamera = require('./ws/ws_camera');

var dataRouter = require('./routes/data');
var videoRouter = require('./routes/video');
var commandRouter = require('./routes/command');
var missionRouter = require('./routes/mission');
var stateRouter = require('./routes/state');


// Config
var userConfigPath = __dirname + '/../../Config/config.yaml';
var defaultConfigPath = __dirname + '/../config.yaml';
var configPath = fs.existsSync(userConfigPath) ? userConfigPath : defaultConfigPath;
global.config = yaml.safeLoad(fs.readFileSync(configPath));

// Global data
global.currentMission = null;
global.globalData = {
    pos: [],
    mot: [],
    batt: [],
    data: [],
    state: []
};
if (config.common.map && config.common.map.initialPosition && config.common.map.initialPosition.lat && config.common.map.initialPosition.lng) {
    globalData.pos.push({
        type: '$POS',
        date: new Date(),
        content: {lat: config.common.map.initialPosition.lat, lng: config.common.map.initialPosition.lng, yaw: 0, speed: 0, signal: 0}
    });
}

// States
global.STATE_IDLE = 0;
global.STATE_RUNNING = 1;
global.STATE_PAUSE = 2;
global.STATE_RTL = 3;
global.STATE_EMERGENCY = 4;
global.currentState = STATE_IDLE;
globalData.state.push({
    type: '$STATE',
    date: new Date(),
    content: { state: currentState }
});

// TCP Clients
global.commandTCP = undefined;
global.dataTCP = undefined;
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
app.use(commandRouter);
app.use(missionRouter);
app.use(stateRouter);

// Camera
if (config.web.camera && config.web.camera.enable) {
    app.use(videoRouter);
    wsCamera.initWebSocket();
}

app.listen(config.web.webServer.port);