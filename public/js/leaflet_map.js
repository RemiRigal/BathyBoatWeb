var globalMap, miniMap;
var currentPolyline = {mini: L.polyline([], {color: 'white'}), global: L.polyline([], {color: 'white'})};
var currentPolygon = {mini: L.polygon([], {color: 'white'}), global: L.polygon([], {color: 'white'})};
var currentPoints = {mini: [], global: []};

var nbrPoint = 1;

$(document).ready(function() {
    globalMap = L.map('gloablMap').setView([48.199040, -3.015805], 17);
    miniMap = L.map('miniMap').setView([48.199040, -3.015805], 17);
    globalMap.on('click', onMapClick);

    L.tileLayer('http://localhost:29201/images/maps/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 13
    }).addTo(globalMap);
    L.tileLayer('http://localhost:29201/images/maps/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 13
    }).addTo(miniMap);
});

function onMapClick(e) {
    if ($('#name_mission').html() === ""){
        return
    }
    addPoint(e.latlng);
    nbrPoint ++;
}

function addPoint(latlng){
    var mission_name = $('#name_mission').html();
    var markerMini = L.circleMarker(latlng, {color: 'red'});
    var markerGlobal = L.circleMarker(latlng, {color: 'red'});
    currentPoints.global.push(markerGlobal);
    currentPoints.mini.push(markerMini);
    globalMap.addLayer(markerGlobal);
    miniMap.addLayer(markerMini);

    if (mission_name === "Waypoints"){
        addCurentPolyLine(latlng);
    } else if (mission_name === "Radiales"){
        addCurrentPolygon(latlng);
    }
    addTablePoints(latlng);
}

function addCurentPolyLine(latlng){
    currentPolyline.global.addLatLng(latlng);
    currentPolyline.mini.addLatLng(latlng);
    currentPolyline.global.addTo(globalMap);
    currentPolyline.mini.addTo(miniMap);
}

function addCurrentPolygon(latlng){
    currentPolygon.global.addLatLng(latlng);
    currentPolygon.mini.addLatLng(latlng);
    currentPolygon.global.addTo(globalMap);
    currentPolygon.mini.addTo(miniMap);
}

function addTablePoints(latlng){
    var div1 = document.createElement('div');
    div1.innerHTML = "<b>Point " + nbrPoint + "</b>";
    var div2 = document.createElement('div');
    div2.setAttribute('class', 'col-xs-10');
    div2.innerHTML = latlng.lat.toFixed(6) + "; " + latlng.lng.toFixed(6);

    var td = document.createElement('td');
    td.appendChild(div1).appendChild(div2);
    var tr = document.createElement('tr');
    tr.appendChild(td);
    $('#table_points_mission').append(tr);
}


function cleanPolyline(){
    currentPolyline.global.remove();
    currentPolyline.global.setLatLngs([]);
    currentPolyline.mini.remove();
    currentPolyline.mini.setLatLngs([]);
}

function cleanPolygon(){
    currentPolygon.global.remove();
    currentPolygon.global.setLatLngs([]);
    currentPolygon.mini.remove();
    currentPolygon.mini.setLatLngs([]);
}

function cleanPoints(){
    nbrPoint = 1;
    for (var i=0; i < currentPoints.global.length; i++){
        miniMap.removeLayer(currentPoints.mini[i]);
        globalMap.removeLayer(currentPoints.global[i]);
    }
    currentPoints.mini = [];
    currentPoints.global = [];
    $('#table_points_mission').empty();
}
