var express = require('express');
var fs = require('fs');

var router = express.Router();


router.post('/command/rtl', function(req, res) {
    commandTCP.write('RTL\0');
    res.status(200);
    res.send(true);
});

router.post('/command/emergency', function(req, res) {
    commandTCP.write('EMERGENCY\0');
    res.status(200);
    res.send(true);
});

router.post('/command/resume', function(req, res) {
    commandTCP.write('RESUME\0');
    res.status(200);
    res.send(true);
});

router.post('/command/pause', function(req, res) {
    commandTCP.write('PAUSE\0');
    res.status(200);
    res.send(true);
});

router.post('/command/stop', function(req, res) {
    commandTCP.write('STOP\0');
    res.status(200);
    res.send(true);
});

router.post('/command/mission', function(req, res) {
    currentMission = req.body.mission;
    var missionName = getMissionName();

    fs.writeFile(config.common.missions.path + missionName, currentMission, function (error) {
        if (error) {
            res.status(500);
            res.send('Unable to save mission file');
            throw error;
        }
        commandTCP.write('MISSION|' + missionName + '\0');
        res.status(200);
        res.send(true);
    });
});

router.post('/command/speed', function(req, res) {
    var speed = parseFloat(req.body.speed);
    commandTCP.write('SPEED|' + speed + '\0');
    res.status(200);
    res.send(true);
});

router.post('/command/factors', function(req, res) {
    var p = parseFloat(req.body.p);
    var i = parseFloat(req.body.i);
    commandTCP.write('FACTOR|' + p + '|' + i + '\0');
    res.status(200);
    res.send(true);
});

function getMissionName() {
    var now = new Date();
    return config.common.missions.name.replace('{DATE}', now.toLocaleDateString()).replace('{TIME}', now.toLocaleTimeString());
}

module.exports = router;