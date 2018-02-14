var mainRow, footerBar, mainPanel;
var mainTabContent, mainTabHead;
var globalMapContainer;

var globalData = {
    pos: [],
    mot: [],
    batt: [],
    data: []
};

function setTelemetry(lat, long, yaw, speed) {
    $('#speed_lvl').html(Math.round(speed * 10) / 10 + ' kts');
    $('#yaw_lvl').html(Math.round(yaw * 10) / 10 + '°');

    // var deg = utmToDeg(lat, long);
    // updatePosition(deg.lat, deg.lng, true);
    // $('#latitude').html(deg.lat);
    // $('#longitude').html(deg.lng);

    $('#latitude').html(lat);
    $('#longitude').html(long);
    updatePosition(lat, long, true);
}

function setConnectionState(connected) {
    $('#wifi_text').html(connected ? 'Connecté' : 'Déconnecté');
}

function setBatteryLevels(m1, m2, elec) {
    $('#motor1_lvl_bat').html('M1: ' + m1 + '%');
    $('#motor1_lv2_bat').html('M2: ' + m2 + '%');
    $('#elec_lvl_bat').html('Elec: ' + elec + '%');
}

function onWindowResized() {
    mainRow.height($(window).height() - footerBar.height());
    mainPanel.height(mainPanel.parent().height() - (mainPanel.outerHeight(true) - mainPanel.outerHeight(false)));
    mainTabContent.height(mainTabContent.parent().height() - mainTabHead.height());
    globalMapContainer.height(globalMapContainer.parent().height());
    if (globalMap && globalMap.map) {
        setTimeout(globalMap.map.invalidateSize, 500);
    }
}


$(document).ready(function() {
    mainRow = $('#main_row');
    footerBar = $('#footer_bar');
    mainPanel = $('#main_panel');
    mainTabContent = $('#main_tab_content');
    mainTabHead = $('#main_tab_head');
    globalMapContainer = $('#globalMap');

    $(window).on('resize', onWindowResized);
    onWindowResized();
});