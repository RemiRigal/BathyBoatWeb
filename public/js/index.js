var mainRow, footerBar, mainPanel;
var mainTabContent, mainTabHead;
var globalMapContainer;

var speedLvl, yawLvl, latitude, longitude;
var b1Lvl, b2Lvl, b1Image, b2Image;

var batteryImages = ['battery_very_low.png', 'battery_low.png', 'battery_not_so_full.png', 'battery_almost_full.png', 'battery_full.png'];

var globalData = {
    pos: [],
    mot: [],
    batt: [],
    data: [],
    state: []
};

function setTelemetry(lat, long, yaw, speed) {
    speedLvl.html(Math.round(speed * 10) / 10 + ' m/s');
    yawLvl.html(Math.round(yaw) + '°');
    latitude.html(lat);
    longitude.html(long);
    updatePosition(lat, long);
}

function setBatteryLevels(b1, b2) {
    var b1Idx = Math.floor((b1 + 24) / 25);
    var b2Idx = Math.floor((b2 + 24) / 25);
    b1Lvl.html('B1: ' + Math.round(b1) + '%');
    b2Lvl.html('B2: ' + Math.round(b2) + '%');
    b1Image.prop('src', 'images/' + batteryImages[b1Idx]);
    b2Image.prop('src', 'images/' + batteryImages[b2Idx]);
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

    speedLvl = $('#speed_lvl');
    yawLvl = $('#yaw_lvl');
    latitude = $('#latitude');
    longitude = $('#longitude');
    b1Lvl = $('#b1_lvl_bat');
    b2Lvl = $('#b2_lvl_bat');
    b1Image = $('#b1_image');
    b2Image = $('#b2_image');

    $(window).on('resize', onWindowResized);
    onWindowResized();
});