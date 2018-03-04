# BathyBoatWeb
![Status](https://img.shields.io/badge/Status-In%20Development-red.svg)
![NodeJS](https://img.shields.io/badge/NodeJS-v8.9.4-green.svg)
![NPM](https://img.shields.io/badge/npm-5.6.0-green.svg)

Hydro/Rob Project - Guerlédan 2017/2018 - WebApp  
This project aims at providing a web-based monitoring and planning UI for robots. It's designed to be used with [BathyBoatNav](https://github.com/RemiRigal/BathyBoatNav) that interacts with sensors and actuators.



## Installation
The web server uses the version v8.9.4 LTS of the [NodeJS](https://nodejs.org/en) framework.  
NodeJS (alongside npm) can be installed [via apt](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) for Debian and Ubuntu based distributions.  

Once NodeJS is installed and the repository cloned, open a terminal in the root directory and install all packages:
```shell
npm install
```
You should now be ready to go:
```shell
nodejs ./server/app.js
```
The web server is now running on port 29201, you can test it by accessing the url `http://localhost:29201`.


## Configuration
The web server must be configured with a `config.yaml` file placed in a `Config` directory in the parent of the git repository.  
The structure is:  
```
/MyProject  
    /BathyBoatWeb  
        ...  
    /Config  
        /config.yaml
```
The `config.yaml` file must respect the following layout:
```yaml
### Required ###
webServer:
    port: 29201
    rosIP: 172.0.0.1
missions:
    path: /home/helios/Helios/Missions/
    name: Mission_{DATE}_{TIME}.json
tcp:
    dataPort: 29200
    commandPort: 22300
    
### Optional ###
map:
    initialPosition:
        lat: 48.395497
        lng: -4.390246
camera: 
    enable: true
    streamPort: 8081
    webSocketPort: 8082
    record:
        enable: true
        path: /home/helios/Helios/Recordings/
        name: Record_{DATE}_{TIME}.ts
```


## Web server
The web server is performing different tasks:
- Dowloading map tiles and keeping them for further session
- Receiving data from a ROS TCP server
- Sending commands to a ROS TCP server
- Sending real-time video stream to the web client via web socket


## Video stream
To enable the real-time video stream from a video device you must use `ffmpeg` to direct the stream to the web server.  
For this purpose, the shell script `video_capture.sh` in the scripts directory provides a working example. However, it's necessary to execute this shell script by using the node package `pm2` so that the trigger on the web page work and that the video capture starts whenever a video device is plugged in.  
For such a configuration you must install `pm2` globally.
```shell
npm install -g pm2
cd BathyBoatWeb/Scripts
pm2 start video_capture.sh
```
See the `pm2` [documentation](https://www.npmjs.com/package/pm2) for more details.
