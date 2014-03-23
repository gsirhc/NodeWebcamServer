var timeWindow = require('../capture/timeWindow');

exports.index = function(req, res) {
    var settings = res.app.locals["settings"];
    var sunrisesunset = timeWindow.getSunriseSunset(settings);

    res.render('index', { title: settings.Title, settings: settings, sunrisesunset: sunrisesunset });
};