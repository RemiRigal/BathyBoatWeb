var fs = require('fs');
var request = require('request');
var mkdir = require('mkdirp');


var mapboxToken = 'pk.eyJ1IjoicmVtaXJpZ2FsIiwiYSI6ImNqYW1hamE4NjMyaTQzMm8ya3hnYng0c3EifQ.2wKZ-kDFg42q8d1xW9p2zg';
var mapboxUrl = "https://api.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token={accessToken}";


module.exports = function(req, res, next) {
    var mapTilePattern = '/images/maps';
    if (req.url.substring(0, mapTilePattern.length) !== mapTilePattern) {
        next();
        return;
    }
    var splitted = req.url.split('/');
    var z = splitted[3];
    var x = splitted[4];
    var y = splitted[5].split('.')[0];
    if (hasMap(z, x, y)) {
        next();
        return;
    }
    download(z, x, y, function (success) {
        if (success) {
            next();
        } else {
            res.status(404);
            res.send("Not found");
        }
    });
};

function hasMap(z, x, y) {
    var tilePath = getMapTilePath(z, x, y);
    return fs.existsSync(tilePath.filePath);
}

function download(z, x, y, callback) {
    var uri = mapboxUrl;
    uri = uri.replace('{z}', z).replace('{x}', x).replace('{y}', y);
    uri = uri.replace('{accessToken}', mapboxToken);
    var tilePath = getMapTilePath(z, x, y);

    mkdir(tilePath.dirPath, function(error) {
        if (error) {
            console.log('Unable to make path for map tile: ' + error);
            if (callback) callback(false);
            return;
        }
        var file = fs.createWriteStream(tilePath.filePath);
        file.on('open', function() {
            request.head(uri, function(error) {
                if (error) {
                    console.log('Unable to download map tile: ' + error);
                    if (callback) callback(false);
                    file.close();
                    return;
                }
                request(uri).pipe(file).on('close', function() {
                    if (callback) callback(true);
                    console.log("Downloaded map tile: " + tilePath.filePath);
                });
            });
        });
    });
}

function getMapTilePath(z, x, y) {
    return {
        filePath: __dirname + "/../../public/images/maps/" + z + "/" + x + "/" + y + ".png",
        dirPath: __dirname + "/../../public/images/maps/" + z + "/" + x
    };
}