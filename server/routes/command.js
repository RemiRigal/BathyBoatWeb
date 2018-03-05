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
    var file = fs.createWriteStream(config.missions.path + missionName);
    file.on('open', function() {
        file.write(currentMission);
        file.close();
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

function getMissionName() {
    var now = new Date();
    return config.missions.name.replace('{DATE}', now.toLocaleDateString()).replace('{TIME}', now.toLocaleTimeString());
}

module.exports = router;