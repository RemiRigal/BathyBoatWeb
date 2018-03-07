var panelMonitoring, panelMission, stateText;
var sessionTime, sessionProgress;
var pauseButtonFsm, resumeButtonFsm;

var sessionStart = null;
var sessionDuration = 0;

var currentState = 0;
var states = ['En attente', 'En mission', 'Pause', 'RTL', 'Alerte de niv.5'];


function setCurrentState(state) {
    state = parseInt(state);
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
            updateSessionTime();
            break;
        case 2:
            stopSessionDuration();
            setPauseState();
            break;
    }
}

function updateSessionTime() {
    if (sessionStart !== null) {
        var now = new Date();
        sessionDuration += (now - sessionStart);
        sessionStart = now;
    }
    sessionTime.html(new Date(sessionDuration - (1000 * 3600)).toLocaleTimeString());
    var progress = Math.round(100 * sessionDuration / 60);
    sessionProgress.attr('style', 'width: ' + progress + '%');
    if (currentState === 1) {
        setTimeout(updateSessionTime, 1000);
    }
}

function startSessionDuration() {
    sessionStart = new Date();
}

function stopSessionDuration() {
    if (sessionStart === null) {
        sessionDuration = 0;
    } else {
        sessionDuration += (new Date() - sessionStart);
        sessionStart = null;
    }
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
    resumeButtonFsm.hide();
    pauseButtonFsm.hide();
    sessionTime.parent().hide();
    sessionProgress.parent().parent().hide();
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
    resumeButtonFsm.hide();
    pauseButtonFsm.show();
    sessionTime.parent().show();
    //sessionProgress.parent().parent().show();
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
    resumeButtonFsm.show();
    pauseButtonFsm.hide();
    sessionTime.parent().show();
    //sessionProgress.parent().parent().show();
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
    pauseButtonFsm = $('#pause_button');
    resumeButtonFsm = $('#resume_button');

    pauseButtonFsm.hide();
    resumeButtonFsm.hide();
    sessionTime.parent().hide();
    sessionProgress.parent().parent().hide();

    getCurrentState();
});