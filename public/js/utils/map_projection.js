var degProj4 = new Proj4js.Proj('EPSG:4326');
var utmProj4 = new Proj4js.Proj('EPSG:2154');


function utmToDeg(lat, lng) {
    var p = new Proj4js.Point(lat, lng);
    Proj4js.transform(utmProj4, degProj4, p);
    return { lat: p.x, lng: p.y }
}

function degToUtm(lat, lng) {
    var p = new Proj4js.Point(lat, lng);
    Proj4js.transform(degProj4, utmProj4, p);
    return { lat: p.x, lng: p.y }
}