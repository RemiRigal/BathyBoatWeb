var long, lat, mpp, zoom, scale, size, taillemap, kmpd, deltalong, deltalat;
var longmin, longmax, latmin, latmax, longpp, latpp;
var svg;
var sizeaffichageimage = 500;
var circle;

long = -3.020906;                                                   //longitude du centre de l'image, à récupérer plus tard automatiquement via url api google
lat = 48.2040407;                                                   //idem latitude
zoom = 15;                                                          //idem zoom
scale = 2;
size=640;
mpp = 156543.03392 * (Math.cos(lat * Math.PI / 180) / (scale * Math.pow(2, zoom)));    //metre par pixel de l'image
taillemap = mpp * scale * size;                                                      //taille de la carte en metre
kmpd = (40075.017 / 360) * Math.cos(lat * Math.PI / 180);                           //km par degré en fonction de la latitude
deltalong = taillemap / (2000 * kmpd);                                   //difference de longitude entre centre et bord de l'image
deltalat = taillemap / (222000);                                        //idem pour latitude, utilisée avec la valeur moyenne de 111km par degré (pas d'échelle)
longmin = long - deltalong;
longmax = long + deltalong;
latmin = lat - deltalat;
latmax = lat + deltalat;
longpp = 2 * deltalong / (sizeaffichageimage);                                 //longitude par pixel sur l'image
latpp = 2 * deltalat / (sizeaffichageimage);                                   //idem pour latitude

function updatePosition(latitude, longitude, remove){
    if (circle !== undefined && remove === true){
        circle.remove();
    }
    var difflong, nbrpixlong, difflat, nbrpixlat;
    
    difflong = longitude-longmin;
    nbrpixlong = Math.round(difflong/longpp);
    difflat = Math.abs(latitude-latmax);
    nbrpixlat = Math.round(difflat/latpp);

    console.log(nbrpixlat, nbrpixlong);

    circle = svg.append("circle")
        .attr("cx", nbrpixlong)
        .attr("cy", nbrpixlat)
        .attr("r", 3)
        .attr("fill", "red");
}

$(document).ready(function() {
    svg = d3.select("#global_map")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500)
        .attr("id", "svg_map");
    $('#svg_map').html('<image xlink:href="images/mapguerledanglobale.png" height="500px" width="500px"></image>');

    //updatePosition(48.199040, -3.015805);
});