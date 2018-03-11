var emergencyButton, rtlButton, resumeButton, pauseButton, speedCursor, speedRegulation, stopButton;

function sendCommandRequest(request, data) {
    $.ajax({
        type: 'POST',
        url: 'http://' + document.location.hostname + ':29201/command' + request,
        data: data ? data : {},
        error: function(error) {
            console.log(error);
        }
    });
}

function onEmergencyButtonClicked() {
    sendCommandRequest('/emergency');
}

function onResumeButtonClicked() {
    sendCommandRequest('/resume');
}

function onPauseButtonClicked() {
    sendCommandRequest('/pause');
}

function onRTLButtonClicked() {
    sendCommandRequest('/rtl');
}

function onSTOPButtonClicked() {
    sendCommandRequest('/stop');
}

function onSpeedValueUpdated() {
    var value = speedCursor.prop('value') / 100;
    speedRegulation.html(value + "");
    sendCommandRequest('/speed', { speed: value });
}

function setSpeedFactor(speedFactor) {
    speedCursor.prop('value', speedFactor);
    speedRegulation.html(speedFactor + "");
}


$(document).ready(function() {
    emergencyButton = $('#emergency_button');
    rtlButton = $('#rtl_button');
    resumeButton = $('#resume_button');
    pauseButton = $('#pause_button');
    speedCursor = $('#speed_cursor');
    speedRegulation = $('#speed_regulation');
    stopButton = $('#stop_button');

    emergencyButton.on('click', onEmergencyButtonClicked);
    rtlButton.on('click', onRTLButtonClicked);
    resumeButton.on('click', onResumeButtonClicked);
    pauseButton.on('click', onPauseButtonClicked);
    speedCursor.on('input', onSpeedValueUpdated);
    stopButton.on('click', onSTOPButtonClicked);
});