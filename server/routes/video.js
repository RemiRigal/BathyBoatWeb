var express = require('express');
var shell = require('shelljs');


var router = express.Router();

router.post('/video', function(req, res) {
    if (req.body.action === 'enable') {
        console.log('Starting capture');
        shell.exec('pm2 start video-capture');
    } else {
        console.log('Stopping capture');
        shell.exec('pm2 stop video-capture');
    }
    console.log(new Date(new Date() - new Date(req.body.time)));
});

module.exports = router;