var panelMonitoring, panelMission, stateText;
var sessionTime, sessionProgress;

var sessionStart = null;
var sessionDuration = 0;

var currentState = 0;
var states = ['En attente', 'Mission en cours', 'Mission interrompue', 'RTL', 'Alert de niveau 5'];


function setCurrentState(state) {
    if (currentState === state) {
        return;
    }
    stateText.html(states[state]);
    switch (state) {
        case 0:
            resetSessionDuration();
            setIdleState();
            break;
        case 1:
            startSessionDuration();
            setRunningState();
            break;
        case 2:
            stopSessionDuration();
            setPauseState();
            break;
    }
}

function updateSessionTime() {
    sessionTime.html(sessionDuration.toLocaleTimeString());
    // TODO: replace 600 with total time
    var progress = Math.round(100 * sessionDuration / 60);
    sessionProgress.attr('style', 'width: ' + progress + '%');
    if (currentState === 1) {
        setTimeout(updateSessionTime, 1000);
    }
}

function startSessionDuration() {
    sessionStart = new Date();
    updateSessionTime();
}

function stopSessionDuration() {
    sessionDuration += new Date() - sessionStart;
    sessionStart = null;
}

function resetSessionDuration() {
    sessionDuration = 0;
    sessionStart = null;
}

function setIdleState() {
    currentState = 0;
    panelMission.show();
    panelMonitoring.hide();
    missions.forEach(function(m) { m.missionDelete.show(); });
    resumeButton.hide();
    pauseButton.hide();
    sessionTime.parent().hide();
    sessionProgress.parent().hide();
}

function setRunningState() {
    currentState = 1;
    panelMission.hide();
    panelMonitoring.show();
    if (globalMap.mission) {
        globalMap.mission.missionBody.slideUp();
    }
    missions.forEach(function(m) { m.missionDelete.hide(); });
    globalMap.setMission(null);
    miniMap.setMission(null);
    resumeButton.hide();
    pauseButton.show();
    sessionTime.parent().show();
    sessionProgress.parent().show();
}

function setPauseState() {
    currentState = 2;
    panelMission.hide();
    panelMonitoring.show();
    if (globalMap.mission) {
        globalMap.mission.missionBody.slideUp();
    }
    missions.forEach(function(m) { m.missionDelete.hide(); });
    globalMap.setMission(null);
    miniMap.setMission(null);
    resumeButton.show();
    pauseButton.hide();
    sessionTime.parent().show();
    sessionProgress.parent().show();
}

function getCurrentState() {
    $.ajax({
        type: 'GET',
        url: 'http://' + document.domain + ':29201/state',
        success: function(resut) {
            setCurrentState(resut.state);
        }
    });
}


$(document).ready(function() {
    panelMonitoring = $('#panel_monitoring');
    panelMission = $('#panel_mission');
    stateText = $('#state_text');
    sessionTime = $('#session_time');
    sessionProgress = $('#session_progress');

    sessionTime.parent().hide();
    sessionProgress.parent().hide();

    getCurrentState();
});