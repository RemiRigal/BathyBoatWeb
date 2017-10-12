var lastUpdate = undefined;

function success(result) {
    var json = JSON.parse(result);
    lastUpdate = json.newUpdate;

    globalData.pos.concat(json.pos);
    globalData.data.concat(json.data);
    globalData.batt.concat(json.batt);
    globalData.mot.concat(json.mot);

    if (json.pos.length > 0) {
        var pos = json.pos[json.pos.length - 1].content;
        setTelemetry(pos.lat, pos.long, pos.yaw, pos.pitch, pos.roll, pos.speed, pos.signal);
    }
    if (json.data.length > 0) {
        var data = json.data[json.data.length - 1].content;
        // TODO
    }
    if (json.batt.length > 0) {
        var batt = json.batt[json.batt.length - 1].content;
        setBatteryLevels(batt.m1, batt.m2, batt.elec);
    }
    if (json.mot.length > 0) {
        var mot = json.mot[json.mot.length - 1].content;
        setBatteryLevels(mot.m1, mot.m2, mot.elec);
    }

    //console.log(globalData);
    setTimeout(requestData, 100);
}

function requestData() {
    var data = {};
    if (lastUpdate !== undefined) {
        data.lastUpdate = lastUpdate;
    }
    $.ajax({
        type: 'GET',
        url: 'http://192.168.0.10:29201/data',
        data: data,
        success: success,
        error: function(error) {
            console.log(error);
        }
    });
}

$(document).ready(function() {
    setTimeout(requestData, 100);
});
