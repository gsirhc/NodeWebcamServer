var ftp = require('ftp')
var fs = require('fs');
var capture = require('./commandLineCapture');
var path = require('path');
var moment = require('moment');

exports.send = function(settings) {
     if (settings.FtpHost == "")
         return;

     var c = new ftp();
     c.on('ready', function() {
         var timeStr = moment().format("L LT");
         try {
             var localPath = capture.getImagePath(settings);
             var ftpPath = settings.FtpUploadPath;
             ftpPath = path.join(ftpPath, capture.getImageFileName(settings));      

             var start = new Date();

             c.put(localPath, ftpPath, function(err) {
                if (err) {
                    console.error("FTP PUT Error: " + err);
                }
                c.end();
                
                console.log("[" + timeStr + "]" + " Sent image to FTP server in " + ((new Date()).getTime() - start.getTime()) + " ms. (" + ftpPath + ")");
             });
         } catch (ex) {
             console.error("[" + timeStr + "]" + " FATAL FTP Error: " + ex);
         }
     });

     c.connect({ host: settings.FtpHost, port: settings.FtpPort,
                user: settings.FtpUser, password: settings.FtpPassword
            }
         );
};