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
                jsonMissionName = file.name;
                var jsonFileMission = JSON.parse(e.target.result);
                console.log(jsonFileMission);
                console.log(jsonMissionName);
                showingWaypoints();
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

function onStartMissionButtonClicked() {
    if (missions.length > 0) {
        var jsonFileMission = getJsonFileMission();
        $.ajax({
            type: 'POST',
            url: 'http://' + document.location.hostname + ':29201/command/mission',
            data: { mission: JSON.stringify(jsonFileMission) },
            error: function(error) {
                console.log(error);
            }
        });
    }
}

$(document).ready(function() {
    exportButton = $('#export_mission_button');
    exportButton.on('click', createJsonFile);
    importButton = $('#import_mission_button');
    importButton.on('click', chooseFile);
    startMission = $('#start_mission');
    startMission.on('click', onStartMissionButtonClicked);
});