var addMissionButton, missionList;

var missions = [];
var missionId = 0;

function cleanAll(){
    cleanPolyline();
    cleanPolygon();
    cleanPoints();
}

function Mission(missionId) {

    this.setType = function(type) {
        this.type = type;
        this.missionPoints.html('');
        cleanAll();
        if (this.type === 'Waypoints') {

        } else if (this.type === 'Radiales') {

        }
    };

    this.initHtml = function() {
        this.htmlElement.html('<div id="mission_header_' + this.id + '" class="col-xs-12">' +
            '<div class="pull-left h4">' + this.name + '</div>' +
            '<span id="delete_mission_' + this.id + '" class="pull-right glyphicon glyphicon-remove" style="padding-top: 10px"></span>' +
            '</div>' +
            '<div class="col-xs-12" id="mission_body_' + this.id + '"><div>' +
            '<select id="select_mission_type_' + this.id + '" class="form-control">' +
            '<option>Waypoints</option><option>Radiales</option>' +
            '</select>' +
            '<div id="mission_points_' + this.id + '"></div></div>' +
            '</div>');
        this.selectMissionType = $('#select_mission_type_' + this.id);
        this.missionHeader = $('#mission_header_' + this.id);
        this.missionBody = $('#mission_body_' + this.id);
        this.missionPoints = $('#mission_points_' + this.id);
        $('#delete_mission_' + this.id).on('click', {element: this.htmlElement}, function(event) {
            event.data.element.remove();
        });
        this.selectMissionType.on('change', {mission: this}, function(event) {
            event.data.mission.setType(event.data.mission.selectMissionType.prop('value'));
        });
        this.missionHeader.on('click', {mission: this}, function(event) {
            event.data.mission.missionBody.slideToggle();
        });
    };

    this.id = missionId;
    this.name = 'Mission' + missionId;
    this.type = 'Waypoints';
    this.points = [];

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
