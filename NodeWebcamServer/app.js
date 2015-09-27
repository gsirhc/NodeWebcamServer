/**
 * Node based Webcam server.  See README.md on GitHub for more information.  
 *
 * Webcam server URLs:
 *    http://localhost:8080/ - HTML page displaying image, title and optionally a refresh link.
 *   
 *    http://localhost:8080/image - Returns the last captured image file with the appropriate MIME type
 *
 *    http://localhost:8080/refresh - Forces an immediate capture of the image.  Note, only one user can refresh at a time.
 *
 *    http://localhost:8080/timelapse - View a time lapse of the image, EnableTimelapse must be set to true
 * 
 * PLEASE REVIEW THE WEBCAM SERVER SETTINGS BELOW BEFORE RUNNING FOR THE FIRST TIME
 */

/**
 * Webcam Server Settings.
 */
var settings = {
    /** The port which the Webcam server will run on. */
    ServerPort: 8080,

    /** The command line program to execute that will capture an image from the camera to a file.  
     * By default, fswebcam is supported however any commandline program can be used here.  
     * Just make sure it is referenced in the system path.
     * Arguments (optional):
     *       {height}: replaced with ImageHeight
     *       {width}: replaced with ImageWidth
     *       {fileName}: replaced with CaptureToFileName
     */
    CaptureCommand: "fswebcam -r {height}x{width} {fileName}",

    /** Path to the image file.  This can be anywhere but the user running the web app must have read/write permissions. 
      * If a relative path is given, will create the file in the /public folder within this app. */
    CaptureToFilePath: "webcam.jpg",

    /** Image height in pixels */
    ImageHeight: 1024,

    /** Image width in pixels */
    ImageWidth: 768,

    /** Interval in seconds at which the CaptureCommand is executed.  Please note capturing the image can take time so if you
     * set this too low, the system will not be able to keep up.  For example, on a Raspberry Pi, the fswebcam command
     * can take upwards of 5 seconds to complete.  Its suggested that you time the command and double the interval at a minimum.
     * Also see FtpIntervalSeconds notes below if using FTP. */
    CaptureIntervalSeconds: 60,

    /** Time window during a 24 hour period to capture the image. Leave blank for no restrictions.  Format is:
     *      HH:MM
     *  Hours (HH) should be relative to the 24 clock.  For example 5pm is 17:00
     *
     *  Optionally use SUNRISE+/-MM or SUNSET+/-MM to use with respect to local sunrise or sunset.  Latitude and Longitude are required.
     *  Also ensure your system time is set to the correct timezone for the Lat/Long.
     *
     *  Examples:
     *      "SUNRISE": Starts/ends right at the calculated SUNRISE time.
     *      "SUNSET": Starts/ends right at the calculated SUNSET time.
     *      "SUNRISE+15": Sunrise + 15 minutes.  Good to ensure there is enough light.
     *      "SUNSET-15": Sunset - 15 minutes.  Good to ensure there is enough light. */
    CaptureTimeWindowStart: "",
    CaptureTimeWindowEnd: "",

    /** Required only if CaptureTimeWindow or FtpTimeWindow use SUNRISE or SUNSET.  This is the decimal representation of the
     * Latitude and Longitude of your system.  Does not need to be exact but should represent your rough location (i.e. the 
     * town or city) within the timezone.*/
    Latitude: "",
    Longitude: "",
    
    /** Title presented on the index page */
    Title: "Welcome to the WebCam",

    /** If true, will allow users capture the latest image from the camera by clicking a refresh link.  
     * Not recommend if open to the internet. */
    AllowRefreshNow: true,

    /** FTP hostname or IP to send the image to.  Leave blank if you do not wish to use FTP. */
    FtpHost: "",

    /** FTP port to send the image to.  Default is 21. */
    FtpPort: 21,

    /** FTP username. Use "anonymous" for anonumous connections.*/
    FtpUser: "anonymous",

    /** FTP password. Use "anonymous@" for anonumous connections.*/
    FtpPassword: "anonymous@",

    /** FTP path to upload the file to.  To use a different file name then CaptureToFilePath, include the filename in the FTP path. */
    FtpUploadPath: "/",

    /** FTP interval in seconds to send the file.  Can be different from CaptureIntervalSeconds but note that Capture and FTP 
     * actions are different operations.  So the FTP'd image will only be as fresh as the last time it was captured.  If this 
     * interval is the same as the capture interval, both will be executed at the same time in sequence (capture then FTP). */
    FtpIntervalSeconds: 600,

    /** Time window during a 24 hour period to FTP the image. Leave blank to use same resitrction as CaptureTimeWindow.  See CaptureTimeWindow notes for format. */
    FtpTimeWindowStart: "",
    FtpTimeWindowEnd: "",

    /** Set to true to save a history of images and enable the time lapse link.  The time lapse interval is the same as CaptureIntervalSeconds. */
    EnableTimelapse: false,
    
    /** The length of time in hours to keep time lapse history.  Older images are deleted. */
    TimelapseMaxHistoryHours: 48
};
/**
 * END Web Server Settings
 */

var express = require('express');
var routes = require('./routes');
var image = require('./routes/image');
var refresh = require('./routes/refresh');
var timelapse = require('./routes/timelapse.js')
var http = require('http');
var path = require('path');
var capture = require('./capture/commandLineCapture');
var settingsOverride = require('./config.json')

if (settingsOverride.UseTheseSettings) {
    settings = settingsOverride;
}

var app = express();

// all environments
app.set('port', settings.ServerPort);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.locals({ settings: settings });

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/', routes.index);
app.get('/image', image.get);
app.get('/refresh', refresh.get);
app.get('/timelapse', timelapse.get)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Run capture command to grab an image and FTP it at startup, then run at interval
capture.execute(settings, capture.CAPTURE_FTP); // NOTE: Will not FTP if FtpHost is empty.

// Capture the image at an interval.  If FTP is enabled and the capture interval and FTP interval
// are the same, do them both in a single call.  Otherwise just capture the image.
if (settings.FtpHost == "" || settings.CaptureIntervalSeconds != settings.FtpIntervalSeconds) {
    setInterval(function() { capture.execute(settings, capture.CAPTURE) }, settings.CaptureIntervalSeconds * 1000);
} else if (settings.CaptureIntervalSeconds == settings.FtpIntervalSeconds) {
    setInterval(function() { capture.execute(settings, capture.CAPTURE_FTP) }, settings.CaptureIntervalSeconds * 1000);
}

// If FTP is enabled and the FTP interval differs from the capture interval, run FTP separately.
if (settings.FtpHost != "" && settings.CaptureIntervalSeconds != settings.FtpIntervalSeconds) {
    // FTP the image at FtpIntervalSeconds
    setInterval(function() { capture.execute(settings, capture.FTP) }, settings.FtpIntervalSeconds * 1000);    
}