var exportButton, importButton;
var jsonFileMission = JSON.parse("{\n\"missions\": [\n{\n\"type\": \"WayPoint\",\n\"wayPoints\": [\n{\n\"latitude\": 48.198150,\n\"longitude\": -3.015854\n},\n{\n\"latitude\": 48.199040,\n\"longitude\": -3.015805\n}\n]\n},\n{\n\"type\": \"WayPoint\",\n\"wayPoints\": [\n{\n\"latitude\": 48.198150,\n\"longitude\": -3.015854\n}\n]\n}\n]\n}");
var jsonMissionName = "mission0.json";

function chooseFile() {
    var chooser = $('#importDialog');
    chooser.unbind('change');
    chooser.change(function(evt) {
        var files = evt.target.files;
        var reader = new FileReader();

        reader.onloadend = ( function(file) {
            return function(e) {
                jsonMissionName = file.name;
                jsonFileMission = JSON.parse(e.target.result);
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
    var buttonExp = $('#export_mission_button');
    var file = new Blob([JSON.stringify(jsonFileMission)], {type: JSON});
    // console.log(file);
    buttonExp.attr("href", URL.createObjectURL(file));
    buttonExp.attr("download", jsonMissionName);
    console.log("export", buttonExp.attr("href"));
}

$(document).ready(function() {
    exportButton = $('#export_mission_button');
    exportButton.on('click', createJsonFile);
    importButton = $('#import_mission_button');
    importButton.on('click', chooseFile);
});