var stopButton, rtlButton, resumeButton, pauseButton, speedCursor, speedRegulation;

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

function onStopButtonClicked() {
    sendCommandRequest('/emergency');
}

function onStartButtonClicked() {
    sendCommandRequest('/resume');
}

function onIdleButtonClicked() {
    sendCommandRequest('/pause');
}

function onRTLButtonClicked() {
    sendCommandRequest('/rtl');
}

function onSpeedValueUpdated() {
    var value = speedCursor.prop('value') / 100;
    speedRegulation.html(value + "");
    sendCommandRequest('/speed', { speed: value });
}


$(document).ready(function() {
    stopButton = $('#stop_button');
    rtlButton = $('#rtl_button');
    resumeButton = $('#resume_button');
    pauseButton = $('#pause_button');
    speedCursor = $('#speed_cursor');
    speedRegulation = $('#speed_regulation');

    stopButton.on('click', onStopButtonClicked);
    rtlButton.on('click', onRTLButtonClicked);
    startButton.on('click', onStartButtonClicked);
    idleButton.on('click', onIdleButtonClicked);
    speedCursor.on('input', onSpeedValueUpdated)
});