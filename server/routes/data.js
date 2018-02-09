var express = require('express');
var backendUtils = require('../utils/backend_utils');

var router = express.Router();


router.get('/data', function(req, res) {
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

module.exports = router;