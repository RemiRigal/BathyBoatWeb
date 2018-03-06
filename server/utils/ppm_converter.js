var shell = require('shelljs');
var fs = require('fs');
var PNG = require('pngjs').PNG;


var blueviewImagePattern = '/images/blueview';
var ppmPath = '/home/helios/Blueview/Daemon/cimg.ppm';
var pngPath = '/home/helios/Helios/Web/public/images/blueview/img.png';
var pngNormalizedPath = '/home/helios/Helios/Web/public/images/blueview/imgn.png';


module.exports = function(req, res, next) {
    if (req.url.substring(0, blueviewImagePattern.length) !== blueviewImagePattern) {
        next();
        return;
    }
    shell.exec('convert ' + ppmPath + ' ' + pngPath);
    var readStream = fs.createReadStream(pngPath).pipe(new PNG({filterType: 4}));
    readStream.on('parsed', function() {
        var min = 255;
        var max = 0;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;
                min = Math.min(min, this.data[idx], this.data[idx+1], this.data[idx+2]);
                max = Math.max(max, this.data[idx], this.data[idx+1], this.data[idx+2]);
            }
        }
        var lerp = function(x) {
            return Math.round(255 * (max - x) / (max - min));
        };

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;

                this.data[idx] = 255 - lerp(this.data[idx]);
                this.data[idx+1] = 255 - lerp(this.data[idx+1]);
                this.data[idx+2] = 255 - lerp(this.data[idx+2]);
            }
        }
        var writeStream = fs.createWriteStream(pngNormalizedPath);
        this.pack().pipe(writeStream);
        writeStream.on('close', function() {
            next();
        });
    });
};