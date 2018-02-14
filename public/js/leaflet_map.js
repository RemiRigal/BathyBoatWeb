var globalMap, miniMap;

var currentPolyline = {mini: L.polyline([], {color: 'white'}), global: L.polyline([], {color: 'white'})};
var currentPolygon = {mini: L.polygon([], {color: 'white'}), global: L.polygon([], {color: 'white'})};
var currentPoints = {mini: {}, global: {}};
var currentMarker = null;
var nbrPoint = 1;
var isDragging = false;

function LeafletMap(id, position, zoom, interactive) {

    var leafletMap = this;

    this.clearMission = function(mission) {
        mission.polyline.remove();
        mission.polygon.remove();
        mission.markers.forEach(function(m) { m.remove(); });
        if (leafletMap.mission.radiales) {
            leafletMap.mission.radiales.forEach(function(l) { l.remove(); });
        }
    };

    this.unsetMission = function(mission) {
        leafletMap.clearMission(mission);
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
            // TODO: radiales
            leafletMap.displayRadiales();
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
                latlngs = leafletMap.mission.polygon.getLatLngs()[0];
                latlngs[markerId] = new L.LatLng(latlng.lat, latlng.lng);
                leafletMap.mission.polygon.setLatLngs(latlngs);
                // TODO: radiales
                leafletMap.displayRadiales();
            }
        } else if (leafletMap.currentMarker !== null) {
            leafletMap.currentMarker = null;
        }
    };

    this.setPositionMarker = function(lat, lng) {
        this.positionMarker.setLatLng(new L.LatLng(lat, lng), {draggable: false});
    };

    this.displayRadiales = function() {
        var points = leafletMap.mission.polygon.getLatLngs()[0];
        if (points.length > 2) {
            var polygon = [];
            points.forEach(function(p) {
                polygon.push([p.lat, p.lng]);
            });
            var radiales = radiale(leafletMap.mission.angle, leafletMap.mission.span, polygon);
            if (leafletMap.mission.radiales) {
                leafletMap.mission.radiales.forEach(function(l) { l.remove(); });
            }
            leafletMap.mission.radiales = [];
            radiales.forEach(function(r) {
                var line = L.polyline([], {color: leafletMap.mission.color});
                line.addLatLng(new L.LatLng(r[0][0], r[0][1]));
                line.addLatLng(new L.LatLng(r[1][0], r[1][1]));
                line.addTo(leafletMap.map);
                leafletMap.mission.radiales.push(line);
            });
        }
    };

    this.mission = null;
    this.isDragging = false;
    this.currentMarker = null;
    this.nbrPoint = 0;
    this.map = L.map(id).setView(position, zoom);
    L.tileLayer('http://' + document.location.hostname + ':29201/images/maps/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 0
    }).addTo(this.map);
    this.positionMarker = L.circleMarker(position, {
        color: '#00fffc',
        attribution: 'Position'
    });
    this.positionMarker.addTo(this.map);

    if (interactive) {
        this.map.on('click', this.onMapClicked);
        this.map.on('mouseup', this.onMouseUp);
        this.map.on('mousemove', this.onMouseMove);
    }
}

function onMapUpdated() {

}

function updatePosition(lat, lng, remove) {
    globalMap.setPositionMarker(lat, lng);
    miniMap.setPositionMarker(lat, lng);
}


$(document).ready(function() {
    globalMap = new LeafletMap('globalMap', [48.199040, -3.015805], 17, true);
    miniMap = new LeafletMap('miniMap', [48.199040, -3.015805], 17, false);
});