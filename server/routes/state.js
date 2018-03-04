var express = require('express');


var router = express.Router();

router.get('/state', function(req, res) {
    res.send({
        state: currentState
    });
});

module.exports = router;