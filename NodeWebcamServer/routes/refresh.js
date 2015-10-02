var capture = require('../capture/commandLineCapture');

exports.get = function(req, res) {
    var settings = res.app.locals["settings"];
    if (settings.AllowRefreshNow) {
        capture.execute(settings);
        res.redirect(307, '/');
    } else {
        res.send(401);
    }
};