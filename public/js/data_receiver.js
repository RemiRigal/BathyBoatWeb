var lastUpdate = undefined;
var yaw;


function success(result) {
    var json = JSON.parse(result);
    lastUpdate = json.newUpdate;

    globalData.pos.concat(json.pos);
    globalData.data.concat(json.data);
    globalData.batt.concat(json.batt);
    globalData.mot.concat(json.mot);
    globalData.state.concat(json.state);

    if (json.pos.length > 0) {
        var pos = json.pos[json.pos.length - 1].content;
        yaw = pos.yaw;
        setTelemetry(pos.lat, pos.lng, pos.yaw, pos.speed, pos.signal);
    }
    if (json.data.length > 0) {
        var data = json.data[json.data.length - 1].content;
    }
    if (json.batt.length > 0) {
        var battery = json.batt[json.batt.length - 1].content;
        setBatteryLevels(battery.b1, battery.b2);
    }
    if (json.mot.length > 0) {
        var mot = json.mot[json.mot.length - 1].content;
        updateBars(mot.m1, mot.m2);
    }
    if (json.state.length > 0) {
        var state = json.state[json.state.length - 1].content;
        setCurrentState(state.state);
        setRegulationFactors(state.pFactor, state.iFactor, state.dFactor);
        setSpeedFactor(state.speedFactor);
    }
    setTimeout(requestData, 100);
}

function requestData() {
    var data = {};
    if (lastUpdate !== undefined) {
        data.lastUpdate = lastUpdate;
    }
    $.ajax({
        type: 'GET',
        url: 'http://' + document.domain + ':29201/data',
        data: data,
        success: success,
        error: function(error) {
            //console.log(error);
        }
    });
}

$(document).ready(function() {
    //setInterval(requestData, 1000);
    setTimeout(requestData, 100);
});
