
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

