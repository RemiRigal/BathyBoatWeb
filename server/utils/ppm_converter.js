var shell = require('shelljs');
var fs = require('fs');
var PNG = require('pngjs').PNG;


var blueviewImagePattern = '/images/blueview';
var ppmPath = '/home/user/BlueView/bvtsdk/examples/net_sonar/cimg.ppm';
var pngPath = __dirname + '/../../public/images/blueview/img.png';


module.exports = function(req, res, next) {
    if (req.url.substring(0, blueviewImagePattern.length) !== blueviewImagePattern) {
        next();
        return;
    }
    shell.exec('convert ' + ppmPath + ' ' + pngPath);

    fs.createReadStream(pngPath).pipe(new PNG({filterType: 4}))
        .on('parsed', function() {
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;

                    // invert color
                    this.data[idx] = 255 - this.data[idx];
                    this.data[idx+1] = 255 - this.data[idx+1];
                    this.data[idx+2] = 255 - this.data[idx+2];

                    // and reduce opacity
                    this.data[idx+3] = this.data[idx+3] >> 1;
                }
            }
            this.pack().pipe(fs.createWriteStream(pngPath));
            console.log('Done');
            next();
        });
};