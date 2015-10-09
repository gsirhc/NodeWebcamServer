var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var moment = require('moment');

var capture = require('../capture/commandLineCapture');
var timeWindow = require('../capture/timeWindow');

exports.get = function (req, res) {
    var settings = res.app.locals["settings"];
    var imagePath = capture.getImagePath(settings);
    var directory = path.dirname(imagePath);
    directory = path.join(directory, "timelapse");
    var extension = path.extname(imagePath);
    
    fs.readdir(directory, function (err, files) {
        if (err) {
            throw err;
        }
        
        console.log("Files " + files.length);

        var imageFiles = _.filter(files, function (file) {
            return getTimeFromFileName(file) && path.extname(imagePath) === extension;
        });
        
        if (req.query.reduce) {   
            var reduce = parseInt(req.query.reduce);
            imageFiles = _.filter(imageFiles, function (file, index) {
                return index % reduce === 0;
            });
        }

        imageFiles = _.sortBy(imageFiles, function (file) {       
            return getTimeFromFileName(file);
        });

        var images = _.map(imageFiles, function (file) {
            var time = getTimeFromFileName(file);

            return {
                filePath: file,
                timeStr: moment(new Date(time)).format('L LT')
            }
        });
        
        var sunrisesunset = timeWindow.getSunriseSunset(settings);

        res.render('timelapse', { title: settings.Title, settings: settings, images: images, sunrisesunset: sunrisesunset });
    });
};

function getTimeFromFileName(fileName) {
    var timeIndexStart = fileName.lastIndexOf("_") + 1;
    var timeIndexEnd = fileName.lastIndexOf(".");
    
    if (timeIndexStart === -1 || timeIndexEnd === -1) {
        return 0;
    }

    var timeStr = fileName.substring(timeIndexStart, timeIndexEnd);
   
    return isNaN(timeStr) ? 0 : parseInt(timeStr);
}