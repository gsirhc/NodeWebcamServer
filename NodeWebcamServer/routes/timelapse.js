var fs = require('fs');
var path = require('path');
var capture = require('../capture/commandLineCapture');
var _ = require('underscore');

exports.get = function (req, res) {
    var settings = res.app.locals["settings"];
    var imagePath = capture.getImagePath(settings);
    var directory = path.dirname(imagePath);
    var extension = path.extname(imagePath)
    
    fs.readdir(directory, function (err, files) {
        if (err) {
            throw new Exception(err);
        }

        var imageFiles = _.filter(files, function (file) {
            var timeIndex = fileName.lastIndexOf("_");
            return timeIndex != -1 && path.dirname(imagePath) == extension;
        });
        
        imageFiles = _.sortBy(imageFiles, function (file) {
            var fileName = path.basename(file, extension);
            var timeIndex = fileName.lastIndexOf("_") + 1;
            var time = fileName.substring(timeIndex);
            
            return parseInt(timeIndex);
        });

        res.render('timelapse', { title: "Time Lapse - " + settings.Title, settings: settings, imageFiles: imageFiles });
    });
};