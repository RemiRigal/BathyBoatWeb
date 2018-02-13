var globalMap, miniMap;

var currentPolyline = {mini: L.polyline([], {color: 'white'}), global: L.polyline([], {color: 'white'})};
var currentPolygon = {mini: L.polygon([], {color: 'white'}), global: L.polygon([], {color: 'white'})};
var currentPoints = {mini: {}, global: {}};
var currentMarker = null;
var nbrPoint = 1;
var isDragging = false;

function LeafletMap(id, position, zoom, interactive) {

    var leafletMap = this;

    this.unsetMission = function(mission) {
        mission.polyline.remove();
        mission.polygon.remove();
        mission.markers.forEach(function(m) { m.remove(); });
        leafletMap.mission = null;
    };

    this.setMission = function(mission) {
        leafletMap.mission = mission;
        leafletMap.mission.polygon.addTo(leafletMap.map);
        leafletMap.mission.polyline.addTo(leafletMap.map);
        leafletMap.mission.markers.forEach(function(m) { m.addTo(leafletMap.map) });
    };

    this.onMarkerMouseDown = function(event) {
        if (event.originalEvent.button === 0 && event.target.options.missionId === leafletMap.mission.id) {
            leafletMap.map.dragging.disable();
            leafletMap.currentMarker = event.target;
            leafletMap.isDragging = true;
        }
    };

    this.addPoint = function(latlng) {
        var marker = L.circleMarker(latlng, {
            color: leafletMap.mission.color,
            attribution: leafletMap.mission.nbrPoint.toString(),
            missionId: leafletMap.mission.id
        });
        leafletMap.mission.nbrPoint++;
        leafletMap.mission.markers.push(marker);
        marker.on('mousedown', leafletMap.onMarkerMouseDown);
        marker.addTo(leafletMap.map);

        if (leafletMap.mission.type === 'Waypoints'){
            leafletMap.mission.polyline.addLatLng(latlng);
            leafletMap.mission.polyline.addTo(leafletMap.map);
        } else if (leafletMap.mission.type === 'Radiales') {
            leafletMap.mission.polygon.addLatLng(latlng);
            leafletMap.mission.polygon.addTo(leafletMap.map);
        }
    };

    this.onMapClicked = function(event) {
        if (leafletMap.mission && leafletMap.currentMarker === null) {
            leafletMap.addPoint(event.latlng);
        }
    };

    this.onMouseUp = function(event) {
        leafletMap.map.dragging.enable();
        leafletMap.isDragging = false;
    };

    this.onMouseMove = function(event) {
        if (leafletMap.isDragging && leafletMap.currentMarker !== null) {
            var latlng = event.latlng;
            var markerId = parseInt(leafletMap.currentMarker.options.attribution);
            leafletMap.currentMarker.setLatLng(new L.LatLng(latlng.lat, latlng.lng), {draggable: true});
            leafletMap.map.addLayer(leafletMap.currentMarker);

            var latlngs;
            if (leafletMap.mission.type === 'Waypoints'){
                latlngs = leafletMap.mission.polyline.getLatLngs();
                latlngs[markerId] = new L.LatLng(latlng.lat, latlng.lng);
                leafletMap.mission.polyline.setLatLngs(latlngs);
            } else if (leafletMap.mission.type === 'Radiales'){
                latlngs = leafletMap.mission.polygon.getLatLngs();
                latlngs[markerId] = new L.LatLng(latlng.lat, latlng.lng);
                leafletMap.mission.polygon.setLatLngs(latlngs);
            }
        } else if (leafletMap.currentMarker !== null) {
            leafletMap.currentMarker = null;
        }
    };

    // this.polyline = L.polyline([], {color: 'white'});
    // this.polygon = L.polygon([], {color: 'white'});
    this.mission = null;
    this.isDragging = false;
    this.currentMarker = null;
    this.nbrPoint = 0;
    this.map = L.map(id).setView(position, zoom);
    L.tileLayer('http://' + document.location.hostname + ':29201/images/maps/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 0
    }).addTo(this.map);

    if (interactive) {
        this.map.on('click', this.onMapClicked);
        this.map.on('mouseup', this.onMouseUp);
        this.map.on('mousemove', this.onMouseMove);
    }
}

function onMapUpdated() {

}

// function onMapClick(e) {
//     if ($('#name_mission').html() === ''){
//         return;
//     }
//     if (currentMarker === null) {
//         addPoint(e.latlng);
//         nbrPoint++;
//     }
// }
//
// function onMouseMove(event){
//     if (isDragging) {
//         var mission_name = $('#name_mission').html();
//         var position = event.latlng;
//         var id = currentMarker.options.attribution;
//         updatePoint(position, id);
//         if (mission_name === "Waypoints"){
//             updateCurrentPolyLine(position, id);
//         } else if (mission_name === "Radiales"){
//             updateCurrentPolygon(position, id);
//         }
//         updateTablePoints(position, id);
//     } else if (currentMarker !== null) {
//         currentMarker = null;
//     }
// }
//
// function onMouseUp(event){
//     isDragging = false;
//     globalMap.dragging.enable();
// }
//
// function onDownMarker(event){
//     globalMap.dragging.disable();
//     currentMarker = event.target;
//     isDragging = true;
// }
//
// function addPoint(latlng){
//     var mission_name = $('#name_mission').html();
//     var markerMini = L.circleMarker(latlng, {color: 'red', attribution: nbrPoint.toString()});
//     var markerGlobal = L.circleMarker(latlng, {color: 'red', draggable: true, attribution: nbrPoint.toString()});
//     markerGlobal.on('mousedown', onDownMarker);
//     currentPoints.global[nbrPoint] = markerGlobal;
//     currentPoints.mini[nbrPoint] = markerMini;
//     globalMap.addLayer(markerGlobal);
//     miniMap.addLayer(markerMini);
//
//     if (mission_name === "Waypoints"){
//         addCurentPolyLine(latlng);
//     } else if (mission_name === "Radiales"){
//         addCurrentPolygon(latlng);
//     }
//     addTablePoints(latlng);
// }
//
// function addCurentPolyLine(latlng){
//     currentPolyline.global.addLatLng(latlng);
//     currentPolyline.mini.addLatLng(latlng);
//     currentPolyline.global.addTo(globalMap);
//     currentPolyline.mini.addTo(miniMap);
// }
//
// function addCurrentPolygon(latlng){
//     currentPolygon.global.addLatLng(latlng);
//     currentPolygon.mini.addLatLng(latlng);
//     console.log(currentPolygon);
//     currentPolygon.global.addTo(globalMap);
//     currentPolygon.mini.addTo(miniMap);
// }
//
// function addTablePoints(latlng){
//     var div1 = document.createElement('div');
//     div1.setAttribute('id', 'point_number' + nbrPoint);
//     div1.setAttribute('class', 'pull-left');
//     div1.innerHTML = "<b>Point " + nbrPoint + "</b>";
//     var div2 = document.createElement('div');
//     div2.setAttribute('class', 'pull-right');
//     div2.setAttribute('class', 'text-right');
//     div2.setAttribute('id', 'latlng_point' + nbrPoint);
//     div2.innerHTML = latlng.lat.toFixed(6) + "; " + latlng.lng.toFixed(6);
//
//     var mainDiv = document.createElement('div');
//     $(div1).appendTo(mainDiv);
//     $(div2).appendTo(mainDiv);
//     $('#table_points_mission').append(mainDiv);
// }
//
//
// function cleanPolyline(){
//     currentPolyline.global.remove();
//     currentPolyline.global.setLatLngs([]);
//     currentPolyline.mini.remove();
//     currentPolyline.mini.setLatLngs([]);
// }
//
// function cleanPolygon(){
//     currentPolygon.global.remove();
//     currentPolygon.global.setLatLngs([]);
//     currentPolygon.mini.remove();
//     currentPolygon.mini.setLatLngs([]);
// }
//
// function cleanPoints(){
//     nbrPoint = 1;
//     for (var i=0; i < Object.entries(currentPoints.mini).length; i++){
//         var id = Object.keys(currentPoints.mini)[i];
//         miniMap.removeLayer(currentPoints.mini[id]);
//         globalMap.removeLayer(currentPoints.global[id]);
//     }
//     currentPoints.mini = {};
//     currentPoints.global = {};
//     $('#table_points_mission').empty();
// }
//
//
// function updateCurrentPolyLine(position, id){
//     var globalLatlngs = currentPolyline.global.getLatLngs();
//     var miniLatlngs = currentPolyline.mini.getLatLngs();
//     globalLatlngs[id - 1] = new L.LatLng(position.lat, position.lng);
//     miniLatlngs[id - 1] = new L.LatLng(position.lat, position.lng);
//     currentPolyline.global.setLatLngs(globalLatlngs);
//     currentPolyline.mini.setLatLngs(miniLatlngs);
// }
//
// function updateCurrentPolygon(position, id){
//     var globalLatlngs = currentPolygon.global.getLatLngs()[0];
//     var miniLatlngs = currentPolygon.mini.getLatLngs()[0];
//     globalLatlngs[id - 1] = new L.LatLng(position.lat, position.lng);
//     miniLatlngs[id - 1] = new L.LatLng(position.lat, position.lng);
//     currentPolygon.global.setLatLngs(globalLatlngs);
//     currentPolygon.mini.setLatLngs(miniLatlngs);
// }
//
// function updateTablePoints(position, id){
//     $('#latlng_point'+ id).text(position.lat.toFixed(6) + "; " + position.lng.toFixed(6));
// }
//
// function updatePoint(position, id){
//     currentMarker.setLatLng(new L.LatLng(position.lat, position.lng), {draggable: 'true'});
//     currentPoints.global[id] = currentMarker;
//     currentPoints.global[id].options.attribution = id;
//     currentPoints.mini[id].setLatLng(new L.LatLng(position.lat, position.lng));
//     currentPoints.mini[id].options.attribution = id;
//     globalMap.addLayer(currentMarker);
//     miniMap.addLayer(currentPoints.mini[id]);
// }


$(document).ready(function() {
    globalMap = new LeafletMap('globalMap', [48.199040, -3.015805], 17, true);
    miniMap = new LeafletMap('miniMap', [48.199040, -3.015805], 17, false);

    // globalMap = L.map('globalMap').setView([48.199040, -3.015805], 17);
    // miniMap = L.map('miniMap').setView([48.199040, -3.015805], 17);
    // globalMap.on('click', onMapClick);
    // globalMap.on('mouseup', onMouseUp);
    // globalMap.on('mousemove', onMouseMove);
    //
    // L.tileLayer('http://' + document.location.hostname + ':29201/images/maps/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     minZoom: 0
    // }).addTo(globalMap);
    // L.tileLayer('http://' + document.location.hostname + ':29201/images/maps/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     minZoom: 0
    // }).addTo(miniMap);
});