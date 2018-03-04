var mainRow, footerBar, mainPanel;
var mainTabContent, mainTabHead;
var globalMapContainer;

var globalData = {
    pos: [],
    mot: [],
    batt: [],
    data: [],
    state: []
};

function setTelemetry(lat, long, yaw, speed) {
    $('#speed_lvl').html(Math.round(speed * 10) / 10 + ' m/s');
    $('#yaw_lvl').html(Math.round((360 * (yaw / (2 * Math.PI)) + 360)%360) + '°');
    $('#latitude').html(lat);
    $('#longitude').html(long);
    updatePosition(lat, long);
}

function updateState(state) {
    var states = ['En attente', 'Mission en cours', 'Mission interrompue', 'RTL', 'Alert de niveau 5'];
    $('#state_text').html(states[state]);
}

function setBatteryLevels(b1, b2) {
    $('#b1_lvl_bat').html('B1: ' + b1 + '%');
    $('#b2_lvl_bat').html('B2: ' + b2 + '%');
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