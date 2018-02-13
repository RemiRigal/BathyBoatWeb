var addMissionButton, missionList;

var currentMission;
var missions = [];
var missionId = 0;

var colors = ['#ff460e', '#21cefa', '#ae10ff', '#00b653', '#ff5f74'];


function Mission(missionId, color) {

    var mission = this;

    this.setType = function(type) {
        this.type = type;
        this.missionPoints.html('');
        if (this.type === 'Waypoints') {

        } else if (this.type === 'Radiales') {

        }
    };

    this.initHtml = function() {
        mission.htmlElement.html('<div id="mission_header_' + mission.id + '" class="col-xs-12">' +
            '<span id="mission_color_' + mission.id + '" class="pull-left" style="border-radius: 100%; width: 20px; height: 20px; display: block; margin: auto"></span>' +
            '<div class="pull-left h4">' + mission.name + '</div>' +
            '<span id="delete_mission_' + mission.id + '" class="pull-right glyphicon glyphicon-remove" style="padding-top: 10px"></span>' +
            '</div>' +
            '<div class="col-xs-12" id="mission_body_' + mission.id + '"><div>' +
            '<select id="select_mission_type_' + mission.id + '" class="form-control">' +
            '<option>Waypoints</option><option>Radiales</option>' +
            '</select>' +
            '<div id="mission_points_' + mission.id + '"></div></div>' +
            '</div>');
        mission.missionColor = $('#mission_color_' + mission.id);
        mission.missionColor.css('background-color', mission.color);
        mission.selectMissionType = $('#select_mission_type_' + mission.id);
        mission.missionHeader = $('#mission_header_' + mission.id);
        mission.missionBody = $('#mission_body_' + mission.id);
        mission.missionPoints = $('#mission_points_' + mission.id);
        $('#delete_mission_' + mission.id).on('click', function() {
            mission.htmlElement.remove();
            globalMap.unsetMission(mission);
        });
        mission.selectMissionType.on('change', function() {
            mission.setType(mission.selectMissionType.prop('value'));
        });
        mission.missionHeader.on('click', function() {
            if (currentMission.id === mission.id) {
                mission.missionBody.slideUp();
                setCurrentMission(null);
            } else {
                mission.missionBody.slideDown();
                setCurrentMission(mission);
            }
        });
    };

    this.id = missionId;
    this.name = 'Mission' + missionId;
    this.type = 'Waypoints';
    this.color = color;
    this.polyline = L.polyline([], {color: 'white'});
    this.polygon = L.polygon([], {color: 'white'});
    this.markers = [];
    this.nbrPoint = 0;

    this.htmlElement = $('#mission_' + missionId);
    this.initHtml();
}

function setCurrentMission(mission) {
    if (currentMission) {
        currentMission.missionBody.slideUp();
    }
    currentMission = mission;
    globalMap.setMission(mission);
}

function onAddMissionClicked() {
    missionId++;
    $('<div class="row" id="mission_' + missionId + '"  style="padding-left: 15px; padding-right: 15px"></div>').appendTo(missionList);
    var color = colors[(missionId - 1) % colors.length];
    var mission = new Mission(missionId, color);
    missions.push(mission);
    setCurrentMission(mission);
}

function getJsonFileMission() {
    var fileMission = { missions: [] };
    missions.forEach(function(m) {
        fileMission.missions.push({
            type: m.type,
            waypoints: m.polyline.getLatLngs()
        });
    });
    return fileMission;
}


$(document).ready(function() {
    addMissionButton = $('#add_mission');
    missionList = $('#missions_list');
    addMissionButton.on('click', onAddMissionClicked);
});
