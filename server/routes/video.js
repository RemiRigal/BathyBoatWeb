var express = require('express');
var shell = require('shelljs');


var router = express.Router();

var videoEnabled = false;

router.get('/video', function(req, res) {
    res.send(videoEnabled);
});

router.post('/video', function(req, res) {
    if (req.body.action === 'enable') {
        console.log('Starting capture');
        shell.exec('pm2 start video_capture', { silent: true });
        videoEnabled = true;
    } else {
        console.log('Stopping capture');
        shell.exec('pm2 stop video_capture', { silent: true });
        videoEnabled = false;
    }
});

shell.exec('pm2 stop video_capture', { silent: true });

module.exports = router;