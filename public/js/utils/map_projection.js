var deg = new Proj4js.Proj('EPSG:4326');
var utm = new Proj4js.Proj('EPSG:27561');

function utmToDeg(lat, lng) {
    var p = new Proj4js.Point(lat, lng);
    Proj4js.transform(utm, deg, p);
    return { lat: p.x, lng: p.y }
}

function degToUtm(lat, lng) {
    var p = new Proj4js.Point(lat, lng);
    Proj4js.transform(deg, utm, p);
    return { lat: p.x, lng: p.y }
}