var sys = require('sys')
var asyncblock = require('asyncblock');
var exec = require('child_process').exec;
var path = require('path');
var ftpImage = require('./ftpImage');
var timeWindow = require('./timeWindow');
var moment = require('moment');

exports.CAPTURE = 1
exports.FTP = 2
exports.CAPTURE_FTP = 2

exports.execute = function(settings, action) {
    asyncblock(function (flow) {
        var timeStr = moment().format("L LT");
        try {                       
            if (action == null || action == exports.CAPTURE || action == exports.CAPTURE_FTP) {
                if (timeWindow.isInTimeWindow(settings.CaptureTimeWindowStart, settings.CaptureTimeWindowEnd, settings.Latitude, settings.Longitude)) {
                    var path = exports.getImagePath(settings);
                    var command = settings.CaptureCommand;

                    command = command.replace("{height}", settings.ImageHeight);
                    command = command.replace("{width}", settings.ImageWidth);
                    command = command.replace("{fileName}", path);
                    
                    var start = new Date();
                    exec(command, flow.add());
                    result = flow.wait();
                    console.log("[" + timeStr + "]" + " Captured image file in " + ((new Date()).getTime() - start.getTime()) + " ms. (" + path + ")");
                }
            }

            if (action == exports.FTP || action == exports.CAPTURE_FTP) {
                var ftpWindowStart = settings.FtpTimeWindowStart == "" ? settings.CaptureTimeWindowStart : settings.FtpTimeWindowStart;
                var ftpWindowEnd = settings.FtpTimeWindowEnd == "" ? settings.CaptureTimeWindowEnd : settings.FtpTimeWindowEnd;

                if (timeWindow.isInTimeWindow(ftpWindowStart, ftpWindowEnd, settings.Latitude, settings.Longitude)) {
                    ftpImage.send(settings);
                }
            } 
        }
        catch (ex) {
            console.error("[" + timeStr + "]" + " FATAL Capture Error: " + ex);
        }
    });    
}

exports.getImagePath = function(settings) {
    var imagePath = settings.CaptureToFilePath;

    if (!imagePath.indexOf("/") == 0) {
        imagePath = __dirname + "/../public/" + imagePath;
    }

    return path.resolve(imagePath);
}

exports.getImageFileName = function(settings) {
    return path.basename(exports.getImagePath(settings));
}