var stopButton, rtlButton, startButton, idleButton;

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
    sendCommandRequest('/stop');
}

function onStartButtonClicked() {
    sendCommandRequest('/start');
}

function onIdleButtonClicked() {
    sendCommandRequest('/idle');
}

function onRTLButtonClicked() {
    sendCommandRequest('/rtl');
}


$(document).ready(function() {
    stopButton = $('#stop_button');
    rtlButton = $('#rtl_button');
    startButton = $('#start_button');
    idleButton = $('#idle_button');

    stopButton.on('click', onStopButtonClicked);
    rtlButton.on('click', onRTLButtonClicked);
    startButton.on('click', onStartButtonClicked);
    idleButton.on('click', onIdleButtonClicked);
});