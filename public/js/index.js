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
}

function setConnectionState(connected) {
    $('#wifi_text').html(connected ? 'Connecté' : 'Déconnecté');
}

function setBatteryLevels(m1, m2, elec) {
    $('#motor1_lvl_bat').html('M1: ' + m1 + '%');
    $('#motor1_lv2_bat').html('M2: ' + m2 + '%');
    $('#elec_lvl_bat').html('Elec: ' + elec + '%');
}

var videoPlayed = false;
function playVideo() {
    if (videoPlayed) {
        console.log('vidéo cliquée');
        $('#video').hide();
        $('#video_button').show();
        videoPlayed = false;
    } else {
        console.log('bouton cliqué');
        $('#video_button').hide();
        $('#video').show();
        videoPlayed = true;
    }
}

$(document).ready(function() {
    $('#video').hide();
    $('#video').on('click', playVideo);
    $('#video_button').on('click', playVideo);
});