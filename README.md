NodeWebcamServer
================

A simple nodejs based webcam server.  

NWS will periodically pull an image from any USB webcam and save it to a local file then serve it up
via a simple Nodejs web server.  NWS can also be configured to FTP the image to any remote site.

Runs on any platform supported by Nodejs.

## Quick Start (Linux)

1. Install [Node](http://nodejs.org/).
2. Install [fswebcam](http://www.firestorm.cx/fswebcam/) on your target distro.
3. Ensure your webcam is plugged into a USB port.
4. Download the entire NWS directory structure from Github.
5. Navigate to the root directory and run:
'''bash npm install'''
6. Give the directory structure Read/Execute permissions
7. Run the following command from the NWS root directory:
'''bash node app.js'''
8. Open a browser to http://localhost:8080

## Configuration
To configure NWS, open app.js in your favorite editor and edit the "Webcam Server Settings:

**CaptureCommand**: The command line program to execute that will capture an image from the camera to a file. By default, fswebcam is supported however any commandline program can be used here.  
** Just make sure it is referenced in the system path. *  
Arguments (optional):
    - {height}: replaced with ImageHeight
    - {width}: replaced with ImageWidth
    - {fileName}: replaced with CaptureToFileName
    
**CaptureToFilePath**:



ImageHeight            |
CaptureIntervalSeconds |
CaptureTimeWindowStart |
CaptureTimeWindowEnd   |
Latitude               |
Longitude              |
Title                  |
AllowRefreshNow        |
FtpHost                |
FtpPort                |
FtpUser                |
FtpPassword            |
FtpUploadPath          |
FtpIntervalSeconds     |
FtpTimeWindowStart     |
FtpTimeWindowEnd       |

## NWS and Raspberry Pi (with Raspian)
1. Install [Node](http://joshondesign.com/2013/10/23/noderpi) for the Pi.
2. Install fswebcam:
'''bash sudo apt-get install fswebcam'''
3. Set a [static IP](https://www.modmypi.com/blog/tutorial-how-to-give-your-raspberry-pi-a-static-ip-address) address for your Pi:
4. Download the entire NWS project to your Pi.
5. Update the Node packages from the NWS project root:
'''bash npm install'''
6. Create a startup script:
'''bash cp nodewebcamserver.sh /etc/init.d'''
7. Start NWS:
'''bash service /etc/init.d/nodewebcamserver start'''
8. Open a browser on another PC or Laptop to http://<ip>:8080 (replace <ip> with the IP address you assigned in step #3)

### Webcams with the Raspberry Pi
It seems most USB webcams are compatible with the Raspberry Pi.  NWS has only been tested with USB
webcam though it may work with the Raspberry Pi camera port.

### Optimal Configuration for the Raspberry Pi
Out of the box, NWS is configured to work with the Pi.  Note that the Pi is slow so take care when
setting the Capture and FTP intervals below the default settings.  Depending on the camera and
resolution, capturing an image to a file can take upwards of 5 seconds.
