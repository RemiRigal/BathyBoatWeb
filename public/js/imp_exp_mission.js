var exportButton, importButton;
var startMission;
var jsonMissionName = "mission.json";

function chooseFile() {
    var chooser = $('#importDialog');
    chooser.unbind('change');
    chooser.change(function(evt) {
        var files = evt.target.files;
        var reader = new FileReader();

        reader.onloadend = ( function(file) {
            return function(e) {
                var jsonFileMission = JSON.parse(e.target.result);
                importMissions(jsonFileMission);
            };
        })(files[0]);

        reader.readAsBinaryString(files[0]);
    });

    chooser.trigger('click');
}

function createJsonFile() {
    var jsonFileMission = getJsonFileMission();
    var file = new Blob([JSON.stringify(jsonFileMission)], {type: JSON});
    exportButton.attr("href", URL.createObjectURL(file));
    exportButton.attr("download", jsonMissionName);
}

function importMissions(jsonMission) {
    currentMission = null;
    missions.forEach(function(m) {
        m.htmlElement.remove();
        globalMap.unsetMission(m);
        //miniMap.unsetMission(m);
    });
    missionList.html('');
    missionId = 0;
    missions = [];
    jsonMission.missions.forEach(function(m) {
        missionId++;
        $('<div class="row" id="mission_' + missionId + '"  style="padding-left: 15px; padding-right: 15px"></div>').appendTo(missionList);
        var color = colors[(missionId - 1) % colors.length];
        var mission = new Mission(missionId, color);
        mission.setType(m.type);
        missions.push(mission);
        setCurrentMission(mission);
        if (m.type === 'Waypoints') {
            m.waypoints.forEach(function(p) {
                globalMap.addPoint(new L.LatLng(p.lat, p.lng));
                mission.nbrPoint++;
            });
        } else if (m.type === 'Radiales') {
            mission.setAngleAndStep(m.angle, m.step);
            m.polygon.forEach(function(p) {
                globalMap.addPoint(new L.LatLng(p.lat, p.lng));
                mission.nbrPoint++;
            });
        }
    });
}

function onStartMissionButtonClicked() {
    var jsonFileMission = getJsonFileMission();
    $.ajax({
        type: 'POST',
        url: 'http://' + document.location.hostname + ':29201/command/mission',
        data: { mission: JSON.stringify(jsonFileMission) },
        error: function(error) {
            console.log(error);
        }
    });
    // TODO: disable interface
}

$(document).ready(function() {
    exportButton = $('#export_mission_button');
    exportButton.on('click', createJsonFile);
    importButton = $('#import_mission_button');
    importButton.on('click', chooseFile);
    startMission = $('#start_mission');
    startMission.on('click', onStartMissionButtonClicked);
});