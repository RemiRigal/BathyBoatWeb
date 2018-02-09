var addMissionButton, missionList;

var missions = [];
var missionId = 0;


function addMission() {
    $('#add_mission').hide();
    $('#menu_type_mission').show();
}

function deleteMission() {
    $('#name_mission').html("");
    $('#add_mission').show();
    $('#menu_type_mission').hide();
    $('#type_mission').hide();
    cleanAll();
}

function cleanAll(){
    cleanPolyline();
    cleanPolygon();
    cleanPoints();
}

function selectTypeRad() {
    $('#name_mission').html("Radiales");
    $('#type_mission').show();
    cleanAll();
}

function selectTypeWay() {
    $('#name_mission').html("Waypoints");
    $('#type_mission').show();
    cleanAll();
}

function Mission(missionId) {

    this.setType = function() {

    };

    this.initHtml = function() {
        this.htmlElement.html('<div>' +
            '<div class="pull-left">' + this.name + '</div>' +
            '<span id="delete_mission_' + this.id + '" class="pull-right glyphicon glyphicon-remove"></span>' +
            '</div>');
        $('#delete_mission_' + this.id).on('click', {element: this.htmlElement}, function(event) {
            event.data.element.remove();
        });
    };

    this.id = missionId;
    this.name = 'Mission' + missionId;
    this.type = 'Waypoints';
    this.waypoints = [];

    this.htmlElement = $('#mission_' + missionId);
    this.initHtml();
}

function onAddMissionClicked() {
    missionId++;
    $('<div class="row" id="mission_' + missionId + '"  style="padding-left: 15px; padding-right: 15px"></div>').appendTo(missionList);
    missions.push(new Mission(missionId));
}


$(document).ready(function() {
    addMissionButton = $('#add_mission');
    missionList = $('#missions_list');
    addMissionButton.on('click', onAddMissionClicked);
});
