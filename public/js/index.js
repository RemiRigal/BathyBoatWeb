var globalData = {
    pos: [],
    mot: [],
    batt: [],
    data: []
};

function setTelemetry(lat, long, yaw, pitch, roll, speed) {
    $('#speed_lvl').html(Math.round(speed * 10) / 10 + ' kts');
    $('#yaw_lvl').html(Math.round(yaw * 10) / 10 + '°');
    $('#latitude').html(lat);
    $('#longitude').html(long);
    updatePosition(lat, long);
}

function setConnectionState(connected) {
    $('#wifi_text').html(connected ? 'Connecté' : 'Déconnecté');
}

function setBatteryLevels(m1, m2, elec) {
    $('#motor1_lvl_bat').html('M1: ' + m1 + '%');
    $('#motor1_lv2_bat').html('M2: ' + m2 + '%');
    $('#elec_lvl_bat').html('Elec: ' + elec + '%');
}

$(document).ready(function() {

});