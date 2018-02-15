var express = require('express');
var backendUtils = require('../utils/backend_utils');

var router = express.Router();


router.get('/mission', function(req, res) {
    res.send(currentMission);
});

module.exports = router;