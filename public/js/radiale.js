
function radiale(angle, span, polygon) {


    polygon.forEach(function(point, index) {
        var newPoint = degToUtm(point[0], point[1]);
        polygon[index] = [newPoint.lat, newPoint.lng];
    });

    span = span * 100000;

    var maxX = polygon[0][0];
    var maxY = polygon[0][1];
    var minX = polygon[0][0];
    var minY = polygon[0][1];

    for (var i = 0; i < polygon.length; i++) {
        if (polygon[i][0] < minX) {
            minX = polygon[i][0];
        }
        else if (polygon[i][0] > maxX) {
            maxX = polygon[i][0];
        }
        if (polygon[i][1] < minY) {
            minY = polygon[i][1];
        }
        else if (polygon[i][1] > maxY) {
            maxY = polygon[i][1];
        }
    }

    var squareSize = 2 * span + Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2));
    var rotMat = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
    var n = Math.floor(squareSize / span) + 1;
    var centeredSegments = [[[-squareSize / 2, -squareSize / 2], [squareSize / 2, -squareSize / 2]]];

    for (var i = 1; i < n; i++) {
        centeredSegments = centeredSegments.concat([[[-squareSize / 2, -squareSize / 2 + i * span], [squareSize / 2, -squareSize / 2 + i * span]]]);
    }

    for (var i = 0; i < centeredSegments.length; i++) {
        centeredSegments[i] = matProd(rotMat, centeredSegments[i]);
    }

    var segments = [];
    var medX = (maxX + minX) / 2;
    var medY = (maxY + minY) / 2;

    for (var i = 0; i < centeredSegments.length; i++) {
        segments = segments.concat([[[centeredSegments[i][0][0] + medX, centeredSegments[i][0][1] + medY], [centeredSegments[i][1][0] + medX, centeredSegments[i][1][1] + medY]]]);
    }

    //return segments;

    var radiales = [];
    for (var i = 0; i < segments.length; i++) {
        var point = [];
        var x = segments[i][0][0];
        var y = segments[i][0][1];
        var startSegmentX, startSegmentY, endSegmentX, endSegmentY;
        var distance = squareSize / 500;
        var outside = true;
        var test = false;
        var m = Math.floor(squareSize / distance) + 1;
        for (var j = 0; j < m; j++) {
            point = [x + j * distance * Math.cos(angle), y - j * distance * Math.sin(angle)];
            test = inside(point, polygon);
            if (test && outside) {
                outside = false;
                startSegmentX = point[0];
                startSegmentY = point[1];
            }
            else if (!(test) && !(outside)) {
                outside = true;
                endSegmentX = point[0] - distance * Math.cos(angle);
                endSegmentY = point[1] - distance * Math.sin(angle);
                radiales = radiales.concat([[[startSegmentX, startSegmentY], [endSegmentX, endSegmentY]]]);
                startSegmentX = 0;
                startSegmentY = 0;
                endSegmentX = 0;
                endSegmentY = 0;
            }
        }
    }

    radiales.forEach(function(point, index) {
        var newStart = utmToDeg(point[0][0], point[0][1]);
        var newEnd = utmToDeg(point[1][0], point[1][1]);
        radiales[index] = [[newStart.lat, newStart.lng], [newEnd.lat, newEnd.lng]];
    });

    return radiales;
}

function inside(point, poly) {
    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        var xi = poly[i][0], yi = poly[i][1];
        var xj = poly[j][0], yj = poly[j][1];

        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

function matProd(matRot, segment) {
    var result = [[0, 0], [0, 0]];
    result[0][0] = segment[0][0] * matRot[0][0] + segment[0][1] * matRot[1][0];
    result[0][1] = segment[0][0] * matRot[0][1] + segment[0][1] * matRot[1][1];
    result[1][0] = segment[1][0] * matRot[0][0] + segment[1][1] * matRot[1][0];
    result[1][1] = segment[1][0] * matRot[0][1] + segment[1][1] * matRot[1][1];
    return result;
}