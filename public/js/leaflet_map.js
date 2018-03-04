var globalMap, miniMap;


function LeafletMap(id, position, zoom, interactive) {

    var leafletMap = this;

    this.clearMission = function(mission) {
        if (mission.objects.has(leafletMap.id)) {
            mission.objects.get(leafletMap.id).polyline.remove();
            mission.objects.get(leafletMap.id).polygon.remove();
            mission.objects.get(leafletMap.id).securityPolyline.remove();
            mission.objects.get(leafletMap.id).markers.forEach(function(m) { m.remove(); });
            mission.objects.get(leafletMap.id).radiales.forEach(function(l) { l.remove(); });
            mission.objects.get(leafletMap.id).radialesMarkers.forEach(function(l) { l.remove(); });
        }
    };

    this.unsetMission = function(mission) {
        leafletMap.clearMission(mission);
        leafletMap.mission = null;
    };

    this.initMissionObjects = function(mission) {
        mission.objects.set(leafletMap.id, {
            polygon: L.polygon([], {color: 'white'}),
            polyline: L.polyline([], {color: 'white'}),
            securityPolyline: L.polyline([], {color: '#ffee00'}),
            markers: [],
            radiales: [],
            radialesMarkers: []
        });
    };

    this.setMission = function(mission) {
        leafletMap.mission = mission;
        if (mission !== null) {
            if (!mission.objects.has(leafletMap.id)) {
                leafletMap.initMissionObjects(mission);
            }
            mission.objects.get(leafletMap.id).polygon.addTo(leafletMap.map);
            mission.objects.get(leafletMap.id).polyline.addTo(leafletMap.map);
            mission.objects.get(leafletMap.id).securityPolyline.addTo(leafletMap.map);
            mission.objects.get(leafletMap.id).markers.forEach(function(m) { m.addTo(leafletMap.map) });
            mission.objects.get(leafletMap.id).radiales.forEach(function(l) { l.addTo(leafletMap.map); });
            mission.objects.get(leafletMap.id).radialesMarkers.forEach(function(l) { l.addTo(leafletMap.map); });
        }
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
        leafletMap.mission.objects.get(leafletMap.id).markers.push(marker);
        marker.on('mousedown', leafletMap.onMarkerMouseDown);
        marker.addTo(leafletMap.map);

        if (leafletMap.mission.type === 'Waypoints'){
            leafletMap.mission.objects.get(leafletMap.id).polyline.addLatLng(latlng);
            leafletMap.mission.objects.get(leafletMap.id).polyline.addTo(leafletMap.map);
        } else if (leafletMap.mission.type === 'Radiales') {
            leafletMap.mission.objects.get(leafletMap.id).polygon.addLatLng(latlng);
            leafletMap.mission.objects.get(leafletMap.id).polygon.addTo(leafletMap.map);
            leafletMap.addSecurityPolygon();
            leafletMap.mission.objects.get(leafletMap.id).securityPolyline.addTo(leafletMap.map);
            leafletMap.displayRadiales();
        }
        if (leafletMap.interactive) {
            onAddPoint(latlng);
        }
    };

    this.addSecurityPolygon = function(){
        var secureDistance = 10;
        var points = leafletMap.mission.objects.get(leafletMap.id).polygon.getLatLngs()[0];
        var size = points.length;
        if (size > 2) {
            var utm = [];
            for (var j = 0; j < size; j++) {
                utm[j] = degToUtm(points[j].lat, points[j].lng);
            }
            var sumLat = utm.reduce(function(acc, p) { return acc + p.lat }, 0);
            var medX = sumLat / size;
            var sumLng = utm.reduce(function(acc, p) { return acc + p.lng }, 0);
            var medY = sumLng / size;
            var homothety = [];
            for (var i = 0; i < size; i++) {
                var lat = (utm[i].lat - medX);
                var lng = (utm[i].lng - medY);
                var dist = Math.sqrt(Math.pow(lat, 2) + Math.pow(lng, 2));
                var ratio = 1 + secureDistance / dist;
                lat = lat * ratio + medX;
                lng = lng * ratio + medY;
                var deg = utmToDeg(lat, lng);
                homothety.push(new L.LatLng(deg.lat, deg.lng));
            }
            if (homothety.length > 0) {
                homothety.push(homothety[0]);
            }
            leafletMap.mission.objects.get(leafletMap.id).securityPolyline.setLatLngs(homothety);
        }
    };

    this.onMapClicked = function(event) {
        if (leafletMap.mission && leafletMap.currentMarker === null && !leafletMap.mouseOverControl) {
            leafletMap.addPoint(event.latlng);
            leafletMap.mission.nbrPoint++;
        }
    };

    this.onMouseUp = function() {
        leafletMap.map.dragging.enable();
        leafletMap.isDragging = false;
    };

    this.updatePoint = function(latlng, markerId) {
        var latlngs;
        if (leafletMap.mission.type === 'Waypoints'){
            latlngs = leafletMap.mission.objects.get(leafletMap.id).polyline.getLatLngs();
            latlngs[markerId] = new L.LatLng(latlng.lat, latlng.lng);
            leafletMap.mission.objects.get(leafletMap.id).polyline.setLatLngs(latlngs);
        } else if (leafletMap.mission.type === 'Radiales'){
            latlngs = leafletMap.mission.objects.get(leafletMap.id).polygon.getLatLngs()[0];
            latlngs[markerId] = new L.LatLng(latlng.lat, latlng.lng);
            leafletMap.mission.objects.get(leafletMap.id).polygon.setLatLngs(latlngs);
            leafletMap.displayRadiales();
            leafletMap.addSecurityPolygon();
        }
    };

    this.onMouseMove = function(event) {
        if (leafletMap.isDragging && leafletMap.currentMarker !== null) {
            var latlng = event.latlng;
            var markerId = parseInt(leafletMap.currentMarker.options.attribution);
            leafletMap.currentMarker.setLatLng(new L.LatLng(latlng.lat, latlng.lng), {draggable: true});
            leafletMap.map.addLayer(leafletMap.currentMarker);
            leafletMap.updatePoint(latlng, markerId);
            if (leafletMap.interactive) {
                onUpdatePoint(latlng, markerId);
            }
        } else if (leafletMap.currentMarker !== null) {
            leafletMap.currentMarker = null;
        }
    };

    this.setPositionMarker = function(lat, lng) {
        this.currentPosition = new L.LatLng(lat, lng);
        this.positionMarker.setLatLng(this.currentPosition, {draggable: false});
        this.positionMarker.setRotationAngle(yaw);
        if (!this.interactive) {
            var currentZoom = leafletMap.map.getZoom();
            this.map.flyTo(this.currentPosition, Math.max(currentZoom, 14));
        }
    };

    this.displayRadiales = function() {
        var points = leafletMap.mission.objects.get(leafletMap.id).polygon.getLatLngs()[0];
        if (points.length > 2) {
            var polygon = [];
            var polygon2 = [];
            points.forEach(function(p) {
                polygon.push([p.lat, p.lng]);
                polygon2.push([p.lat, p.lng]);
            });
            var radiales = radiale(leafletMap.mission.angle, leafletMap.mission.step * 3, polygon);
            if (leafletMap.mission.reverseRadiales) {
                radiales = radiales.reverse();
            }
            if (leafletMap.mission.objects.get(leafletMap.id).radiales) {
                leafletMap.mission.objects.get(leafletMap.id).radiales.forEach(function(l) { l.remove(); });
            }
            leafletMap.mission.objects.get(leafletMap.id).radiales = [];
            leafletMap.mission.objects.get(leafletMap.id).radialesMarkers.forEach(function(m) { m.remove(); });
            leafletMap.mission.objects.get(leafletMap.id).radialesMarkers = [];
            radiales.forEach(function(r, idx) {
                var line = L.polyline([], {color: leafletMap.mission.color});
                var radiale = r;
                if (idx%2 === 0) {
                    radiale = radiale.reverse();
                }
                var radialeMarkerIcon = L.divIcon({
                    html: '<div style="width: 100%; height: 100%; text-align: center; background-color: #ffffff">' + idx + '</div>',
                    iconSize: [16, 16] });
                var radialeMarker = new L.marker(radiale[0], {icon: radialeMarkerIcon}).addTo(leafletMap.map);
                leafletMap.mission.objects.get(leafletMap.id).radialesMarkers.push(radialeMarker);

                line.addLatLng(new L.LatLng(radiale[0][0], radiale[0][1]));
                line.addLatLng(new L.LatLng(radiale[1][0], radiale[1][1]));
                line.addTo(leafletMap.map);
                leafletMap.mission.objects.get(leafletMap.id).radiales.push(line);
            });
        }
    };

    this.addZoomToCurrentButton = function() {
        var zoomToCurrent = L.Control.extend({
            options: { position: 'topleft' },
            onAdd: function (map) {
                var container = L.DomUtil.create('img', 'leaflet-gps');
                container.src = 'images/gps_position.png';
                container.style.marginLeft = '12px';
                container.onclick = function() {
                    var currentZoom = leafletMap.map.getZoom();
                    leafletMap.map.flyTo(leafletMap.currentPosition, Math.max(currentZoom, 14));
                };
                container.onmouseenter = function () { leafletMap.mouseOverControl = true; };
                container.onmouseleave = function () { leafletMap.mouseOverControl = false; };
                return container;
            }
        });
        this.map.addControl(new zoomToCurrent());
    };

    this.id = id;
    this.mission = null;
    this.isDragging = false;
    this.currentMarker = null;
    this.nbrPoint = 0;
    this.radialesMarkers = [];
    this.interactive = interactive;
    this.currentPosition = new L.LatLng(0, 0);
    this.mouseOverControl = false;

    this.map = L.map(id).setView(position, zoom);
    L.tileLayer('http://' + document.location.hostname + ':29201/images/maps/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 3
    }).addTo(this.map);
    var boatIcon = L.icon({
        iconUrl: 'http://' + document.location.hostname + ':29201/images/boat_icon.png',
        iconSize:     [27, 55],
        iconAnchor:   [13, 27]
    });
    this.positionMarker = L.marker(this.currentPosition, {
        color: '#00fffc',
        icon: boatIcon,
        attribution: 'Position'
    }).addTo(this.map);

    if (interactive) {
        this.map.on('click', this.onMapClicked);
        this.map.on('mouseup', this.onMouseUp);
        this.map.on('mousemove', this.onMouseMove);
        this.addZoomToCurrentButton();
    } else {
        this.map.dragging.disable();
        this.map.scrollWheelZoom.disable();
    }
}

function onUpdatePoint(latlng, markerId) {
    miniMap.updatePoint(latlng, markerId);
    globalMap.mission.objects.get(globalMap.id).markers.forEach(function(marker, index) {
        miniMap.mission.objects.get(miniMap.id).markers[index].setLatLng(marker.getLatLng());
    });
}

function onAddPoint(latlng) {
    miniMap.addPoint(latlng);
}

function updatePosition(lat, lng) {
    globalMap.setPositionMarker(lat, lng);
    miniMap.setPositionMarker(lat, lng);
}


$(document).ready(function() {
    globalMap = new LeafletMap('globalMap', [45.199040, -1.015805], 5, true);
    miniMap = new LeafletMap('miniMap', [45.199040, -1.015805], 5, false);
});