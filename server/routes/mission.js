var express = require('express');

var router = express.Router();


router.get('/mission', function(req, res) {
    res.send(currentMission);
});

module.exports = router;