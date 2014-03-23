var path = require('path');
var capture = require('../capture/commandLineCapture');

exports.get = function(req, res) {
    var settings = res.app.locals["settings"];
    res.sendfile(capture.getImagePath(settings));
};