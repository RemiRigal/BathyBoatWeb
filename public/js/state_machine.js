var panelMonitoring, panelMission, stateText;

var currentState = 0;
var states = ['En attente', 'Mission en cours', 'Mission interrompue', 'RTL', 'Alert de niveau 5'];


function setCurrentState(state) {
    stateText.html(states[state]);
    switch (state) {
        case 0:
            setIdleState();
            break;
        case 1:
            setRunningState();
            break;
        case 2:
            setPauseState();
            break;
    }
}

function setIdleState() {
    currentState = 0;
    panelMission.show();
    panelMonitoring.hide();
}

function setRunningState() {
    currentState = 1;
    panelMission.hide();
    panelMonitoring.show();
}

function setPauseState() {
    currentState = 2;
    panelMission.hide();
    panelMonitoring.show();
}

function getCurrentState() {
    $.ajax({
        type: 'GET',
        url: 'http://' + document.domain + ':29201/state',
        success: function(state) {
            console.log(state);
            setCurrentState(state);
        }
    });
}


$(document).ready(function() {
    panelMonitoring = $('#panel_monitoring');
    panelMission = $('#panel_mission');
    stateText = $('#state_text');

    getCurrentState();
});