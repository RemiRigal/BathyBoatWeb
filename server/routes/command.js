var express = require('express');

var router = express.Router();


router.post('/command/rtl', function(req, res) {
    commandTCP.write('RTL\0');
});

router.post('/command/stop', function(req, res) {
    commandTCP.write('STOP\0');
});

router.post('/command/start', function(req, res) {
    commandTCP.write('START\0');
});

router.post('/command/idle', function(req, res) {
    commandTCP.write('IDLE\0');
});

router.post('/command/mission', function(req, res) {
    commandTCP.write('MISSION\0');
});

router.post('/command/spd', function(req, res) {
    var speed = parseFloat(req.body.data.speed);
    commandTCP.write('SPD/' + speed + '\0');
});

module.exports = router;