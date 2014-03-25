Node Webcam Server (NWS)
========================
A simple Node.js based webcam server.  

NWS will periodically pull an image from any USB webcam and save it to a local file then serve it up
via a simple Node.js web server.  NWS can also be configured to FTP the image to any remote site.

Runs on any platform supported by [Node.js](http://nodejs.org/).

## Features
* Very configurable.
* Web based.
* Capture time windows.  You can configure NWS to save images during a specific time window.
* Sunrise/Sunset aware.  Given latitude/longitude NWS can be configured to only pull images during daylight hours.
* FTP.  NWS can be setup to FTP the image to a server.  The FTP interval can be configured separately from the capture interval.

## Requirements
* [Node.js](http://nodejs.org/)
* Command line webcam capture program such as [fswebcam](http://www.firestorm.cx/fswebcam/)

## Quick Start (Linux)

1. Install [Node.js](http://nodejs.org/).
2. Install [fswebcam](http://www.firestorm.cx/fswebcam/) on your target distro.
3. Ensure your webcam is plugged into a USB port.
4. Download the entire NodeWebcamServer directory structure from Github.
5. Navigate to the root application directory (will have a file named app.js in it) and run:

        npm install

6. Give the directory structure Read/Execute permissions:

        chmod 755 NodeWebcamServer

7. Give the /public directory Read/Write permissions

        chmod 755 NodeWebcamServer/public

8. Run the following command from the NWS root directory:

        cd NodeWebcamServer
        node app.js

9. Open a browser to: 

        http://localhost:8080

10. Configure NWS to start automatically using an /etc/init.d or upstart script.  nws.sh is provided as a template for an init.d startup script (configured for the Raspberry Pi).

## Configuration
To configure NWS, open app.js in your favorite editor and modify the "Webcam Server Settings":

**CaptureCommand**: 
The command line program to execute that will capture an image from the camera to a file. By default, 
fswebcam is supported however any commandline program can be used here.  * Just make sure it is referenced in the system path.   

        Arguments (optional):
        * {height}: replaced with ImageHeight,
        * {width}: replaced with ImageWidth,
        * {fileName}: replaced with CaptureToFilePath,
    
**CaptureToFilePath**:
Path to the image file.  This can be anywhere but the user running the web app must have read/write permissions. 
If a relative path is given, NWS will put the file in the /public folder.

**ImageHeight**:
Image height in pixels

**ImageWidth**:
Image width in pixels

**CaptureIntervalSeconds**:
Interval in seconds at which the CaptureCommand is executed.  Please note capturing the image can take time so if you
set this too low, the system will not be able to keep up.  For example, on a Raspberry Pi, the fswebcam command
can take upwards of 5 seconds to complete.  Its suggested that you time the command and double the interval at a minimum.
Also see FtpIntervalSeconds notes below if using FTP.

**CaptureTimeWindowStart** / **CaptureTimeWindowEnd**:
Time window during a 24 hour period to capture the image. Leave blank for no restrictions.  Format is:

        HH:MM

Hours (HH) should be relative to the 24 clock.  For example 5pm is 17:00

Optionally use SUNRISE+/-MM or SUNSET+/-MM to use with respect to local sunrise or sunset.  Latitude and Longitude are required.
Also ensure your system time is set to the correct timezone for the Lat/Long.

        Examples:
        * "SUNRISE": Starts/ends right at the calculated SUNRISE time.
        * "SUNSET": Starts/ends right at the calculated SUNSET time.
        * "SUNRISE+15": Sunrise + 15 minutes.  Good to ensure there is enough light.
        * "SUNSET-15": Sunset - 15 minutes.  Good to ensure there is enough light.

**Latitude** / **Longitude**:
Required only if CaptureTimeWindow or FtpTimeWindow use SUNRISE or SUNSET.  This is the decimal representation of the
Latitude and Longitude of your system.  Does not need to be exact but should represent your rough location (i.e. the 
town or city) within the timezone.

**Title**:
Title presented on the index page

**AllowRefreshNow**:
If true, will allow users capture the latest image from the camera by clicking a refresh link.  
Not recommend if open to the internet.

**FtpHost**:
FTP hostname or IP to send the image to.  Leave blank if you do not wish to use FTP.

**FtpPort**:
FTP port to send the image to.  Default is 21.

**FtpUser**:
FTP username. Use "anonymous" for anonumous connections.

**FtpPassword**:
FTP password. Use "anonymous@" for anonumous connections.

**FtpUploadPath**:
FTP path to upload the file to.  To use a different file name then CaptureToFilePath, include the filename in the FTP path.

**FtpIntervalSeconds**:
FTP interval in seconds to send the file.  Can be different from CaptureIntervalSeconds but note that Capture and FTP 
actions are different operations.  So the FTP'd image will only be as fresh as the last time it was captured.  If this 
interval is the same as the capture interval, both will be executed at the same time in sequence (capture then FTP).

**FtpTimeWindowStart** / **FtpTimeWindowEnd**:
Time window during a 24 hour period to FTP the image. Leave blank to use same resitrction as CaptureTimeWindow.  See CaptureTimeWindow notes for format.


## NWS with Raspberry Pi (Raspian)
1. Install [Node.js](http://joshondesign.com/2013/10/23/noderpi) for the Pi.
2. Install fswebcam:
      
        sudo apt-get install fswebcam

3. Set a [static IP](https://www.modmypi.com/blog/tutorial-how-to-give-your-raspberry-pi-a-static-ip-address) address for your Pi:
4. Download the entire NWS project to your Pi.
5. Update the Node packages from the NWS project root:
      
        sudo npm install

6. Create a startup script and give it read/execute permissions:
      
        sudo cp nws.sh /etc/init.d
        sudo chmod 755 /etc/init.d/nws.sh
7. Start NWS:

        sudo service /etc/init.d/nws start

8. Open a browser on another PC or Laptop to http://ip_address:8080 (replace ip_address with the IP address you assigned in step #3)

### Webcams with the Raspberry Pi
It seems most USB webcams are compatible with the Raspberry Pi.  NWS has only been tested with a USB
webcam though it may work with the Raspberry Pi camera port.

### Optimal Configuration for the Raspberry Pi
Out of the box, NWS is configured to work with the Pi.  Note that the Pi is slow so take care when
setting the Capture and FTP intervals below the default settings.  Depending on the camera and
resolution, capturing an image to a file can take upwards of 5 seconds.

## Security
Securing NWS is your responsibility.  If you open the web port to the internet, you assume any and all responsibilty 
for any user that accesses the image.  Note that NWS does not provide password protection or SSL support.

## License
There is no license for NWS.  NWS is provided as is, free of charge, can be modified and redistributed at will without
permission.
