var addMissionButton, missionList;

var currentMission = null;
var missions = [];
var missionId = 0;

var colors = ['#ff460e', '#21cefa', '#ae10ff', '#00b653', '#ff5f74'];


function Mission(missionId, color) {

    var mission = this;

    this.setType = function(type) {
        this.type = type;
        mission.selectMissionType.prop('value', type);
        this.missionPoints.html('');
        this.missionExtra.html('');
        globalMap.clearMission(mission);
        //miniMap.clearMission(mission);
        this.markers = [];
        this.radiales = [];
        this.polyline = L.polyline([], {color: 'white'});
        this.securityPolygon = L.polygon([], {color: '#ffee00'});
        this.polygon = L.polygon([], {color: 'white'});
        if (this.type === 'Waypoints') {

        } else if (this.type === 'Radiales') {
            mission.missionExtra.html('<strong>Angle: <step id="mission_angle_' + mission.id + '">' + mission.angle + '°</step></strong>' +
                '<input id="mission_angle_input_' + mission.id + '" type="range" value="' + mission.angle + '" min="0" max="6.28" step="0.01"/>' +
                '<strong>Ecart: <step id="mission_step_' + mission.id + '">' + mission.step + '°</step></strong>' +
                '<input id="mission_step_input_' + mission.id + '" type="range" value="' + mission.step + '" min="0.00001" max="0.001" step="0.00001"/>');
            mission.angleDisplay = $('#mission_angle_' + mission.id);
            mission.stepDisplay = $('#mission_step_' + mission.id);
            mission.stepInput = $('#mission_step_input_' + mission.id);
            mission.stepInput.on('input', function(e) {
                mission.step = parseFloat(e.target.value);
                mission.stepDisplay.html(mission.step + '°');
                globalMap.displayRadiales();
                //miniMap.displayRadiales();
            });
            mission.angleInput = $('#mission_angle_input_' + mission.id);
            mission.angleInput.on('input', function(e) {
                mission.angle = parseFloat(e.target.value);
                mission.angleDisplay.html(Math.round(mission.angle * 360 / (2 * Math.PI)) + '°');
                globalMap.displayRadiales();
                //miniMap.displayRadiales();
            });
        }
    };

    this.setAngleAndStep = function(angle, step) {
        mission.angle = angle;
        mission.step = step;
        mission.angleDisplay.html(mission.angle + '°');
        mission.stepDisplay.html(mission.step + '°');
        mission.stepInput.prop('value', mission.step);
        mission.angleInput.prop('value', mission.angle);
    };

    this.updatePoints = function() {
        var latlngs;
        if (mission.type === 'Waypoints') {
            latlngs = mission.polyline.getLatLngs();
        } else if (mission.type === 'Radiales') {
            latlngs = mission.polygon.getLatLngs();
        }
        mission.missionPoints.html(html);
    };

    this.initHtml = function() {
        var html = '<div id="mission_header_' + mission.id + '" class="col-xs-12">' +
            '<step id="mission_color_' + mission.id + '" class="pull-left" style="border-radius: 100%; width: 20px; height: 20px; margin: 10px 5px 10px 5px"></step>' +
            '<div class="pull-left h4">' + mission.name + '</div>' +
            '<step id="delete_mission_' + mission.id + '" class="pull-right glyphicon glyphicon-remove" style="padding-top: 10px"></step>' +
            '</div>' +
            '<div class="col-xs-12" id="mission_body_' + mission.id + '"><div>' +
            '<select id="select_mission_type_' + mission.id + '" class="form-control">' +
            '<option>Waypoints</option><option>Radiales</option>' +
            '</select><div id="mission_extra_' + mission.id + '"></div>' +
            '<div id="mission_points_' + mission.id + '"></div></div></div>';
        mission.htmlElement.html(html);
        mission.missionExtra = $('#mission_extra_' + mission.id);
        mission.missionColor = $('#mission_color_' + mission.id);
        mission.missionColor.css('background-color', mission.color);
        mission.selectMissionType = $('#select_mission_type_' + mission.id);
        mission.missionHeader = $('#mission_header_' + mission.id);
        mission.missionBody = $('#mission_body_' + mission.id);
        mission.missionPoints = $('#mission_points_' + mission.id);
        $('#delete_mission_' + mission.id).on('click', function() {
            mission.htmlElement.remove();
            globalMap.unsetMission(mission);
            //miniMap.unsetMission(mission);
            missions = missions.filter(function(m) { return m.id !== mission.id });
        });
        mission.selectMissionType.on('change', function() {
            mission.setType(mission.selectMissionType.prop('value'));
        });
        mission.missionHeader.on('click', function() {
            if (currentMission !== null && currentMission.id === mission.id) {
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
    this.markers = [];
    this.nbrPoint = 0;
    // Waypoints
    this.polyline = L.polyline([], {color: 'white'});
    // Radiales
    this.polygon = L.polygon([], {color: 'white'});
    this.securityPolygon = L.polygon([], {color: '#ffee00'});
    this.radiales = [];
    this.angle = 0;
    this.step = 0.0005;

    this.htmlElement = $('#mission_' + missionId);
    this.initHtml();
}

function setCurrentMission(mission) {
    if (currentMission) {
        currentMission.missionBody.slideUp();
    }
    currentMission = mission;
    globalMap.setMission(mission);
    //miniMap.setMission(mission);
}

function onAddMissionClicked() {
    missionId++;
    $('<div class="row" id="mission_' + missionId + '"  style="padding-left: 15px; padding-right: 15px"></div>').appendTo(missionList);
    var color = colors[(missionId - 1) % colors.length];
    var mission = new Mission(missionId, color);
    missions.push(mission);
    setCurrentMission(mission);
}

function getCurrentMission() {
    $.ajax({
        type: 'GET',
        url: 'http://' + document.location.hostname + ':29201/mission',
        data: {},
        success: function (m) {
            importMissions(JSON.parse(m));
        }
    });
}

function getJsonFileMission() {
    var fileMission = { missions: [] };
    missions.forEach(function(m) {
        var json = {
            type: m.type
        };
        if (m.type === 'Waypoints') {
            var waypoints = m.polyline.getLatLngs();
            waypoints.forEach(function(p, idx) {
                waypoints[idx] = p;
            });
            json.waypoints = waypoints;
        } else if (m.type === 'Radiales') {
            var radiales = [];
            var mapRadiales = m.radiales;
            m.radiales.forEach(function(r, idx) {
                var latlngs = r.getLatLngs();
                radiales.push({ start: latlngs[0], end: latlngs[1] });
                if (idx < m.radiales.length - 1) {
                    var next = m.radiales[idx + 1].getLatLngs();
                    radiales.push({ start: latlngs[1], end: next[0] });
                }
                mapRadiales[idx] = { start: latlngs[0], end: latlngs[1] };
            });
            json.radiales = radiales;
            json.mapRadiales = mapRadiales;
            var polygon = m.polygon.getLatLngs()[0];
            polygon.forEach(function(p, idx) {
                polygon[idx] = p;
            });
            json.polygon = polygon;
            json.angle = m.angle;
            json.step = m.step;
        }
        fileMission.missions.push(json);
    });
    return fileMission;
}


$(document).ready(function() {
    addMissionButton = $('#add_mission');
    missionList = $('#missions_list');
    addMissionButton.on('click', onAddMissionClicked);
    getCurrentMission();
});
