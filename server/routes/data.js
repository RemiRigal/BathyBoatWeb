var express = require('express');

var router = express.Router();


router.get('/data', function(req, res) {
    var now = new Date();
    var update = globalData;
    update.newUpdate = now;
    res.send(JSON.stringify(update));
});

module.exports = router;