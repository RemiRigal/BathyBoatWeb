var express = require('express');

var router = express.Router();


router.post('/command/rtl', function(req, res) {
    commandTCP.write('RTL');
});

router.post('/command/stop', function(req, res) {
    commandTCP.write('STOP');
});

router.post('/command/start', function(req, res) {
    commandTCP.write('START');
});

router.post('/command/idle', function(req, res) {
    commandTCP.write('IDLE');
});

router.post('/command/spd', function(req, res) {
    var speed = parseFloat(req.body.data.speed);
    commandTCP.write('SPD/' + speed);
});

module.exports = router;