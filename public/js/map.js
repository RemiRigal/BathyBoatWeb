var long, lat, mpp, zoom, scale, size, sizeMap, kmpd, deltaLong, deltaLat;
var longMin, longMax, latMin, latMax, longpp, latpp;
var svg, svgMini, globalMap, miniMap;
var sizeImageDisplay = 1280;
var position, miniPosition;
var wayPoint = [];

function initialisation(/*url*/) {
    long = -3.020906;                                                   //longitude du centre de l'image, à récupérer plus tard automatiquement via url api google
    lat = 48.2040407;                                                   //idem latitude
    zoom = 15;                                                          //idem zoom
    scale = 2;
    size = 640;
    mpp = 156543.03392 * (Math.cos(lat * Math.PI / 180) / (scale * Math.pow(2, zoom)));    //metre par pixel de l'image
    sizeMap = mpp * scale * size;                                                      //taille de la carte en metre
    kmpd = (40075.017 / 360) * Math.cos(lat * Math.PI / 180);                           //km par degré en fonction de la latitude
    deltaLong = sizeMap / (2000 * kmpd);                                   //difference de longitude entre centre et bord de l'image
    deltaLat = sizeMap / (222000);                                        //idem pour latitude, utilisée avec la valeur moyenne de 111km par degré (pas d'échelle)
    longMin = long - deltaLong;
    longMax = long + deltaLong;
    latMin = lat - deltaLat;
    latMax = lat + deltaLat;
    longpp = 2 * deltaLong / (sizeImageDisplay);                                 //longitude par pixel sur l'image
    latpp = 2 * deltaLat / (sizeImageDisplay);                                   //idem pour latitude
}

function coordToPix(latitude,longitude){
    var diffLong = longitude-longMin;
    var nbrPixLong = Math.round(diffLong/longpp);
    var diffLat = Math.abs(latitude-latMax);
    var nbrPixLat = Math.round(diffLat/latpp);

    return ([nbrPixLong,nbrPixLat]);
}

function pixToCoord(pixLong,pixLat){
    var coordLong,coordLat;

    coordLong=pixLong*longpp+longMin;
    coordLat=latMax-pixLat*latpp;

    return ([coordLong,coordLat]);
}
function updatePosition(latitude, longitude, remove){
    if (position !== undefined && remove === true){
        position.remove();
        miniPosition.remove();
    }

    // Récupération des données
    var data,nbrPixLong,nbrPixLat;

    data = coordToPix(latitude, longitude);
    nbrPixLong=data[0];
    nbrPixLat=data[1];

    // Global map
    var wGlobalMap, hGlobalMap;
    wGlobalMap = globalMap.width();
    hGlobalMap = globalMap.height();
    globalMap.css("background-position", "-" + (nbrPixLong - (wGlobalMap/2)) + "px -" + (nbrPixLat - (hGlobalMap/2)) + "px");

    position = svg.append("circle")
        .attr("cx", wGlobalMap/2)
        .attr("cy", hGlobalMap/2)
        .attr("r", 3)
        .attr("fill", "#fab548");

    // Mini map
    var wMiniMap, hMiniMap;
    wMiniMap = miniMap.width();
    hMiniMap = miniMap.height();
    miniMap.css("background-position", "-" + (nbrPixLong - (wMiniMap/2)) + "px -" + (nbrPixLat - (hMiniMap/2)) + "px");

    miniPosition = svgMini.append("circle")
        .attr("cx", wMiniMap/2)
        .attr("cy", hMiniMap/2)
        .attr("r", 3)
        .attr("fill", "#fab548");
}

function showingWaypoints(){                //!!!!!!!!!!!!!! à finir et retravailler !!!!!!!!!!! affiche les waypoints de la trajectoire à partir d'un fichier json de mission

    if (wayPoint !== undefined){
        wayPoint.forEach(function(w){w.remove()});
    }

    wayPoint=[];
    var latitude, longitude;
    var tmp;
    var data=[];

    for (var i=0;i<jsonFileMission.missions[0].wayPoints.length;i++){
        latitude=jsonFileMission.missions[0].wayPoints[i].latitude;
        longitude=jsonFileMission.missions[0].wayPoints[i].longitude;
        tmp = coordToPix(latitude,longitude);
        data.push(tmp);
        console.log(tmp);
        wayPoint.push(svg.append("circle")
            .attr("cx", tmp[0]*globalMap.width()/sizeMap)
            .attr("cy", tmp[1]*globalMap.height()/sizeMap)
            .attr("r", 3)
            .attr("fill", "red"));
    }


}

$(document).ready(function() {
    initialisation();
    globalMap = $('#global_map');
    svg = d3.select("#global_map")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .attr("id", "svg_map");

    miniMap = $('#mini_map');
    svgMini = d3.select("#mini_map")
        .append("svg")
        .attr("id", "svg_mini_map");

    updatePosition(48.20904, -3.016805, true);
});