var fs = require('fs');
var path = require('path');
var findremove = require('find-remove');
var capture = require('./commandLineCapture');

exports.captureTimelapse = function (settings) {
    try {
        var path = capture.getImagePath(settings);
        var directory = path.dirname(path);
        var fullFileName = capture.getImageFileName(settings);
        var extension = path.extname(fullFileName)
        var baseName = path.basename(fullFileName, extension);
        
        var timelapseFileName = path.join(directory, baseName + "_" + new Date().getTime().toString() + extension);
        
        fs.createReadStream(path).pipe(fs.createWriteStream(timelapseFileName));
        console.log("Saved timelapse image " + timelapseFileName);
        
        var result = findRemoveSync(directory, { age: { seconds: settings.TimelapseMaxHistoryHours * 60 * 60 }, extensions: extension });
        console.log("Deleted timelapse files: " + result.length)
    } catch (err) {
        console.log("Error capturing time lapse: " + err)
    }
}